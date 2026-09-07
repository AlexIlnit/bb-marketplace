
// check-by-domains.js
//
// Проверка всех двухбуквенных доменов .BY
// aa.by ... zz.by
//
// WHOIS: whois.cctld.by
//
// Запуск:
//   node check-by-domains.js
//
// Результат:
//   by-domains-all.csv
//   by-domains-free.txt
//   by-domains-registered.txt

import net from "net";
import fs from "fs";
import { setTimeout as sleep } from "timers/promises";

const WHOIS_HOST = "whois.cctld.by";
const WHOIS_PORT = 43;

// Небольшая пауза между запросами.
// Не ставим слишком маленькую, чтобы не получить блокировку.
const DELAY_MS = 500;

// Таймаут одного WHOIS-запроса.
const TIMEOUT_MS = 10000;


// =====================================================
// WHOIS REQUEST
// =====================================================

function whois(domain) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({
      host: WHOIS_HOST,
      port: WHOIS_PORT,
    });

    let data = "";

    const timeout = setTimeout(() => {
      socket.destroy();
      reject(new Error("WHOIS timeout"));
    }, TIMEOUT_MS);

    socket.setEncoding("utf8");

    socket.on("connect", () => {
      socket.write(`${domain}\r\n`);
    });

    socket.on("data", (chunk) => {
      data += chunk;
    });

    socket.on("end", () => {
      clearTimeout(timeout);
      resolve(data);
    });

    socket.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    socket.on("close", () => {
      clearTimeout(timeout);

      if (data) {
        resolve(data);
      }
    });
  });
}


// =====================================================
// CHECK STATUS
// =====================================================

function detectStatus(response) {
  const text = response.toLowerCase();

  // Возможные признаки свободного домена.
  const freePatterns = [
    "no entries found",
    "no match",
    "not found",
    "no data found",
    "domain not found",
    "no object found",
    "status: free",
    "available",
  ];

  for (const pattern of freePatterns) {
    if (text.includes(pattern)) {
      return "FREE";
    }
  }

  // Возможные признаки зарегистрированного домена.
  const registeredPatterns = [
    "domain name:",
    "domain:",
    "registrant:",
    "created:",
    "creation date:",
    "registered:",
    "status:",
  ];

  for (const pattern of registeredPatterns) {
    if (text.includes(pattern)) {
      return "REGISTERED";
    }
  }

  return "UNKNOWN";
}


// =====================================================
// GENERATE DOMAINS
// =====================================================

function generateDomains() {
  const domains = [];

  for (let a = 97; a <= 122; a++) {
    for (let b = 97; b <= 122; b++) {
      const first = String.fromCharCode(a);
      const second = String.fromCharCode(b);

      domains.push(`${first}${second}.by`);
    }
  }

  return domains;
}


// =====================================================
// CSV ESCAPE
// =====================================================

function csvEscape(value) {
  const string = String(value ?? "");

  if (
    string.includes(",") ||
    string.includes('"') ||
    string.includes("\n")
  ) {
    return `"${string.replace(/"/g, '""')}"`;
  }

  return string;
}


// =====================================================
// MAIN
// =====================================================

async function main() {
  console.log("");
  console.log("==============================================");
  console.log("      .BY TWO-LETTER DOMAIN CHECKER");
  console.log("==============================================");
  console.log("");

  console.log(`WHOIS: ${WHOIS_HOST}:${WHOIS_PORT}`);
  console.log("");

  const domains = generateDomains();

  console.log(`Всего доменов: ${domains.length}`);
  console.log("");

  const results = [];

  let free = 0;
  let registered = 0;
  let unknown = 0;

  for (let i = 0; i < domains.length; i++) {
    const domain = domains[i];

    process.stdout.write(
      `[${String(i + 1).padStart(3, " ")}/${domains.length}] ${domain} ... `
    );

    try {
      const response = await whois(domain);

      const status = detectStatus(response);

      results.push({
        domain,
        status,
        response: response
          .replace(/\r/g, "")
          .replace(/\n+/g, " ")
          .trim(),
      });

      if (status === "FREE") {
        free++;

        console.log("FREE");
      } else if (status === "REGISTERED") {
        registered++;

        console.log("REGISTERED");
      } else {
        unknown++;

        console.log("UNKNOWN");
      }
    } catch (error) {
      unknown++;

      results.push({
        domain,
        status: "ERROR",
        response: error.message,
      });

      console.log(`ERROR: ${error.message}`);
    }

    await sleep(DELAY_MS);
  }


  // ===================================================
  // SAVE ALL RESULTS
  // ===================================================

  const csvLines = [
    "domain,status,whois_response",
  ];

  for (const result of results) {
    csvLines.push(
      [
        csvEscape(result.domain),
        csvEscape(result.status),
        csvEscape(result.response),
      ].join(",")
    );
  }

  fs.writeFileSync(
    "by-domains-all.csv",
    csvLines.join("\n"),
    "utf8"
  );


  // ===================================================
  // SAVE FREE DOMAINS
  // ===================================================

  const freeDomains = results
    .filter((item) => item.status === "FREE")
    .map((item) => item.domain);

  fs.writeFileSync(
    "by-domains-free.txt",
    freeDomains.join("\n"),
    "utf8"
  );


  // ===================================================
  // SAVE REGISTERED DOMAINS
  // ===================================================

  const registeredDomains = results
    .filter(
      (item) => item.status === "REGISTERED"
    )
    .map((item) => item.domain);

  fs.writeFileSync(
    "by-domains-registered.txt",
    registeredDomains.join("\n"),
    "utf8"
  );


  // ===================================================
  // SUMMARY
  // ===================================================

  console.log("");
  console.log("==============================================");
  console.log("                 РЕЗУЛЬТАТ");
  console.log("==============================================");
  console.log("");

  console.log(`Всего:          ${domains.length}`);
  console.log(`Свободно:       ${free}`);
  console.log(`Зарегистрировано: ${registered}`);
  console.log(`Не определено:  ${unknown}`);

  console.log("");

  console.log("Файлы:");

  console.log("  by-domains-all.csv");
  console.log("  by-domains-free.txt");
  console.log("  by-domains-registered.txt");

  console.log("");

  if (freeDomains.length > 0) {
    console.log("Свободные домены:");
    console.log("");

    for (const domain of freeDomains) {
      console.log(`  ${domain}`);
    }
  }

  if (unknown > 0) {
    console.log("");
    console.log(
      "ВНИМАНИЕ: есть домены со статусом UNKNOWN."
    );

    console.log(
      "Их нужно проверить повторно вручную."
    );
  }

  console.log("");
}


// =====================================================
// START
// =====================================================

main().catch((error) => {
  console.error("");
  console.error("Критическая ошибка:");
  console.error(error);
  console.error("");

  process.exit(1);
});

