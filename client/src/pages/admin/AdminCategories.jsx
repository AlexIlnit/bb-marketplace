import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";

import { uploadImage } from "../../api/uploadApi";

import { useCategoryStore } from "../../store/categoryStore";


// =====================================================
// SEO HTML РЕДАКТОР
// ВАЖНО: находится ВНЕ AdminCategories
// =====================================================

function SeoEditor({
  value,
  onChange,
  isCreate = false,
}) {
  const editorRef = useRef(null);
  const htmlTextareaRef = useRef(null);
  const savedRangeRef = useRef(null);

  const [focused, setFocused] = useState(false);
  const [htmlMode, setHtmlMode] = useState(false);

  // =====================================================
  // СИНХРОНИЗАЦИЯ ВИЗУАЛЬНОГО РЕДАКТОРА
  // =====================================================

  useEffect(() => {
    if (!editorRef.current) return;

    if (
      !focused &&
      !htmlMode &&
      editorRef.current.innerHTML !== (value || "")
    ) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, focused, htmlMode]);

  // =====================================================
  // INPUT
  // =====================================================

  const handleInput = () => {
    if (!editorRef.current) return;

    onChange(editorRef.current.innerHTML);
  };

  // =====================================================
  // СОХРАНЕНИЕ ВЫДЕЛЕНИЯ
  // =====================================================

  const saveSelection = () => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);

    if (
      editorRef.current &&
      editorRef.current.contains(range.commonAncestorContainer)
    ) {
      savedRangeRef.current = range.cloneRange();
    }
  };

  // =====================================================
  // ВОССТАНОВЛЕНИЕ ВЫДЕЛЕНИЯ
  // =====================================================

  const restoreSelection = () => {
    const selection = window.getSelection();
    const range = savedRangeRef.current;

    if (!selection || !range) return;

    try {
      selection.removeAllRanges();
      selection.addRange(range);
    } catch {
      // selection уже недействителен
    }
  };

  // =====================================================
  // FOCUS
  // =====================================================

  const focusEditor = () => {
    editorRef.current?.focus();
    restoreSelection();
  };

  // =====================================================
  // EXEC COMMAND
  // =====================================================

  const execCommand = (
    command,
    commandValue = null
  ) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    restoreSelection();

    document.execCommand(
      command,
      false,
      commandValue
    );

    handleInput();
    saveSelection();
  };

  // =====================================================
  // FORMAT BLOCK
  // =====================================================

  const formatBlock = (tag) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    restoreSelection();

    document.execCommand(
      "formatBlock",
      false,
      tag
    );

    handleInput();
    saveSelection();
  };

  // =====================================================
  // ССЫЛКА
  // =====================================================

  const addLink = () => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    restoreSelection();

    const selection = window.getSelection();

    if (!selection || selection.toString().trim() === "") {
      alert("Сначала выделите текст для ссылки");
      return;
    }

    const url = window.prompt(
      "Введите URL:",
      "https://"
    );

    if (!url) return;

    document.execCommand(
      "createLink",
      false,
      url.trim()
    );

    handleInput();
    saveSelection();
  };

  // =====================================================
  // ЦВЕТ ТЕКСТА
  // =====================================================

  const changeTextColor = (color) => {
    execCommand(
      "foreColor",
      color
    );
  };

  // =====================================================
  // ЦВЕТ ФОНА
  // =====================================================

  const changeHighlight = (color) => {
    execCommand(
      "hiliteColor",
      color
    );
  };

  // =====================================================
  // ШРИФТ
  // =====================================================

  const changeFont = (font) => {
    execCommand(
      "fontName",
      font
    );
  };

  // =====================================================
  // РАЗМЕР
  // =====================================================

  const changeFontSize = (size) => {
    execCommand(
      "fontSize",
      size
    );
  };

  // =====================================================
  // HTML-РЕЖИМ
  // =====================================================

  const toggleHtmlMode = () => {
    if (!htmlMode) {
      // Входим в HTML режим.
      // HTML уже хранится в value.
      setHtmlMode(true);

      setTimeout(() => {
        htmlTextareaRef.current?.focus();
      }, 0);

      return;
    }

    // Выходим из HTML режима.
    // Значение textarea уже является актуальным.
    setHtmlMode(false);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = value || "";
      }
    }, 0);
  };

  // =====================================================
  // ИЗМЕНЕНИЕ HTML
  // =====================================================

  const handleHtmlChange = (e) => {
    onChange(e.target.value);
  };

  // =====================================================
  // ВСТАВКА HTML
  // =====================================================

  const insertHtml = () => {
    const html = window.prompt(
      "Вставьте HTML:",
      "<p>Ваш текст</p>"
    );

    if (!html) return;

    if (htmlMode) {
      onChange(
        `${value || ""}${html}`
      );

      return;
    }

    editorRef.current?.focus();
    restoreSelection();

    document.execCommand(
      "insertHTML",
      false,
      html
    );

    handleInput();
    saveSelection();
  };

  // =====================================================
  // ОЧИСТКА ФОРМАТИРОВАНИЯ
  // =====================================================

  const clearFormatting = () => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    restoreSelection();

    document.execCommand(
      "removeFormat",
      false,
      null
    );

    document.execCommand(
      "unlink",
      false,
      null
    );

    handleInput();
    saveSelection();
  };

  // =====================================================
  // HTML: ФОРМАТИРОВАТЬ / BEAUTIFY
  // =====================================================

  const formatHtml = () => {
    if (!value) return;

    let formatted = value
      .replace(/></g, ">\n<")
      .replace(
        /<\/(div|p|h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote|table|tr|section)>/g,
        "</$1>\n"
      );

    const lines = formatted
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let indent = 0;

    const result = lines.map((line) => {
      if (
        /^<\//.test(line)
      ) {
        indent = Math.max(
          0,
          indent - 1
        );
      }

      const output =
        "  ".repeat(indent) +
        line;

      if (
        /^<(div|section|article|ul|ol|table|tr|blockquote|h[1-6]|p)(\s|>)/i.test(
          line
        ) &&
        !/<\/(div|section|article|ul|ol|table|tr|blockquote|h[1-6]|p)>$/i.test(
          line
        )
      ) {
        indent++;
      }

      return output;
    }).join("\n");

    onChange(result);
  };

  // =====================================================
  // ОЧИСТИТЬ HTML ОТ INLINE STYLE
  // =====================================================

  const removeInlineStyles = () => {
    if (!value) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(
      value,
      "text/html"
    );

    doc.body
      .querySelectorAll("*")
      .forEach((element) => {
        element.removeAttribute("style");
      });

    onChange(
      doc.body.innerHTML
    );
  };

  // =====================================================
  // PASTE
  // =====================================================

  const handlePaste = (e) => {
    if (htmlMode) {
      return;
    }

    e.preventDefault();

    const html =
      e.clipboardData.getData(
        "text/html"
      );

    const text =
      e.clipboardData.getData(
        "text/plain"
      );

    editorRef.current?.focus();
    restoreSelection();

    if (html) {
      document.execCommand(
        "insertHTML",
        false,
        html
      );
    } else {
      const safeText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");

      document.execCommand(
        "insertHTML",
        false,
        safeText
      );
    }

    handleInput();
    saveSelection();
  };

  // =====================================================
  // PLAIN TEXT
  // =====================================================

  const plainText = (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

  const characterCount =
    plainText.length;

  // =====================================================
  // TOOLBAR BUTTON
  // =====================================================

  const toolbarButton =
    `
      rounded-lg
      border
      border-gray-200
      bg-gray-50
      px-3
      py-2
      text-xs
      font-semibold
      text-gray-700
      transition
      hover:bg-blue-50
      hover:text-blue-600
      active:bg-blue-100
    `;

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-gray-50
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          border-b
          border-gray-200
          bg-white
          px-5
          py-4
        "
      >

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
          "
        >

          <div>
            <h4
              className="
                text-sm
                font-bold
                text-gray-900
              "
            >
              Информационный / SEO-текст
            </h4>

            <p
              className="
                mt-1
                text-xs
                text-gray-500
              "
            >
              Визуальный редактор и прямое редактирование HTML.
            </p>
          </div>

          <div
            className="
              rounded-full
              bg-blue-50
              px-3
              py-1.5
              text-xs
              font-semibold
              text-blue-600
            "
          >
            {characterCount.toLocaleString()} символов
          </div>

        </div>
      </div>


      {/* =================================================
          MODE SWITCH
      ================================================= */}

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          border-b
          border-gray-200
          bg-white
          px-4
          py-3
        "
      >

        <div
          className="
            flex
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-gray-50
          "
        >

          <button
            type="button"
            onClick={() => {
              if (htmlMode) {
                toggleHtmlMode();
              }
            }}
            className={`
              px-4
              py-2
              text-xs
              font-semibold
              transition
              ${
                !htmlMode
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            Визуальный
          </button>

          <button
            type="button"
            onClick={() => {
              if (!htmlMode) {
                toggleHtmlMode();
              }
            }}
            className={`
              px-4
              py-2
              text-xs
              font-semibold
              transition
              ${
                htmlMode
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            &lt;/&gt; HTML
          </button>

        </div>

        <div
          className="
            text-xs
            text-gray-400
          "
        >
          {htmlMode
            ? "Редактируется исходный HTML-код"
            : "Редактируется отображаемый текст"}
        </div>

      </div>


      {/* =================================================
          HTML MODE
      ================================================= */}

      {htmlMode ? (

        <div className="p-4">

          <textarea
            ref={htmlTextareaRef}
            value={value || ""}
            onChange={handleHtmlChange}
            spellCheck={false}
            className="
              min-h-130
              w-full
              resize-y
              rounded-xl
              border
              border-gray-700
              bg-[#111827]
              px-5
              py-5
              font-mono
              text-[14px]
              leading-7
              text-green-300
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
            placeholder={
              isCreate
                ? `<h2>Заголовок</h2>
<p>Текст категории...</p>
<ul>
  <li>Первый пункт</li>
  <li>Второй пункт</li>
</ul>`
                : "<p>Введите HTML...</p>"
            }
          />

          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >

            <button
              type="button"
              onClick={formatHtml}
              className={toolbarButton}
            >
              Форматировать HTML
            </button>

            <button
              type="button"
              onClick={removeInlineStyles}
              className={toolbarButton}
            >
              Убрать inline-стили
            </button>

            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Очистить весь HTML-текст?"
                  )
                ) {
                  onChange("");
                }
              }}
              className="
                rounded-lg
                border
                border-red-200
                bg-red-50
                px-3
                py-2
                text-xs
                font-semibold
                text-red-600
                hover:bg-red-100
              "
            >
              Очистить HTML
            </button>

          </div>

        </div>

      ) : (

        <>
          {/* =================================================
              TOOLBAR
          ================================================= */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-1
              border-b
              border-gray-200
              bg-white
              px-4
              py-3
            "
          >

            {/* UNDO */}

            <button
              type="button"
              title="Отменить"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("undo");
              }}
              className={toolbarButton}
            >
              ↶
            </button>

            {/* REDO */}

            <button
              type="button"
              title="Повторить"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("redo");
              }}
              className={toolbarButton}
            >
              ↷
            </button>

            <div
              className="
                mx-1
                hidden
                h-6
                w-px
                bg-gray-200
                sm:block
              "
            />

            {/* H1 */}

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                formatBlock("h1");
              }}
              className={toolbarButton}
            >
              H1
            </button>

            {/* H2 */}

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                formatBlock("h2");
              }}
              className={toolbarButton}
            >
              H2
            </button>

            {/* H3 */}

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                formatBlock("h3");
              }}
              className={toolbarButton}
            >
              H3
            </button>

            {/* P */}

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                formatBlock("p");
              }}
              className={toolbarButton}
            >
              P
            </button>

            <div
              className="
                mx-1
                hidden
                h-6
                w-px
                bg-gray-200
                sm:block
              "
            />

            {/* FONT */}

            <select
              defaultValue=""
              onChange={(e) => {
                if (!e.target.value) return;

                changeFont(
                  e.target.value
                );

                e.target.value = "";
              }}
              className="
                h-9
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                px-2
                text-xs
                text-gray-700
                outline-none
                focus:border-blue-500
              "
            >
              <option value="">
                Шрифт
              </option>

              <option value="Arial">
                Arial
              </option>

              <option value="Verdana">
                Verdana
              </option>

              <option value="Tahoma">
                Tahoma
              </option>

              <option value="Georgia">
                Georgia
              </option>

              <option value="Times New Roman">
                Times New Roman
              </option>

              <option value="Courier New">
                Courier New
              </option>
            </select>

            {/* SIZE */}

            <select
              defaultValue=""
              onChange={(e) => {
                if (!e.target.value) return;

                changeFontSize(
                  e.target.value
                );

                e.target.value = "";
              }}
              className="
                h-9
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                px-2
                text-xs
                text-gray-700
                outline-none
                focus:border-blue-500
              "
            >
              <option value="">
                Размер
              </option>

              <option value="1">
                10px
              </option>

              <option value="2">
                13px
              </option>

              <option value="3">
                16px
              </option>

              <option value="4">
                18px
              </option>

              <option value="5">
                24px
              </option>

              <option value="6">
                32px
              </option>

              <option value="7">
                40px
              </option>
            </select>

            <div
              className="
                mx-1
                hidden
                h-6
                w-px
                bg-gray-200
                sm:block
              "
            />

            {/* B */}

            <button
              type="button"
              title="Жирный"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("bold");
              }}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                text-sm
                font-black
                text-gray-700
                hover:bg-blue-50
                hover:text-blue-600
              "
            >
              B
            </button>

            {/* I */}

            <button
              type="button"
              title="Курсив"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("italic");
              }}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                font-serif
                text-sm
                italic
                text-gray-700
                hover:bg-blue-50
                hover:text-blue-600
              "
            >
              I
            </button>

            {/* U */}

            <button
              type="button"
              title="Подчёркивание"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("underline");
              }}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                text-sm
                font-bold
                underline
                text-gray-700
                hover:bg-blue-50
                hover:text-blue-600
              "
            >
              U
            </button>

            {/* S */}

            <button
              type="button"
              title="Зачёркивание"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand(
                  "strikeThrough"
                );
              }}
              className={toolbarButton}
            >
              <span className="line-through">
                S
              </span>
            </button>

            {/* TEXT COLOR */}

            <label
              title="Цвет текста"
              className="
                flex
                h-9
                w-9
                cursor-pointer
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                text-sm
                font-black
                text-gray-700
                hover:bg-blue-50
              "
            >
              A

              <input
                type="color"
                defaultValue="#111827"
                onChange={(e) => {
                  changeTextColor(
                    e.target.value
                  );
                }}
                className="
                  absolute
                  h-0
                  w-0
                  opacity-0
                "
              />
            </label>

            {/* HIGHLIGHT */}

            <label
              title="Цвет фона текста"
              className="
                flex
                h-9
                w-9
                cursor-pointer
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-yellow-100
                text-xs
                font-bold
                text-gray-700
              "
            >
              AB

              <input
                type="color"
                defaultValue="#fff59d"
                onChange={(e) => {
                  changeHighlight(
                    e.target.value
                  );
                }}
                className="
                  absolute
                  h-0
                  w-0
                  opacity-0
                "
              />
            </label>

            <div
              className="
                mx-1
                hidden
                h-6
                w-px
                bg-gray-200
                sm:block
              "
            />

            {/* ALIGN LEFT */}

            <button
              type="button"
              title="По левому краю"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand(
                  "justifyLeft"
                );
              }}
              className={toolbarButton}
            >
              ≡←
            </button>

            {/* CENTER */}

            <button
              type="button"
              title="По центру"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand(
                  "justifyCenter"
                );
              }}
              className={toolbarButton}
            >
              ≡
            </button>

            {/* RIGHT */}

            <button
              type="button"
              title="По правому краю"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand(
                  "justifyRight"
                );
              }}
              className={toolbarButton}
            >
              →≡
            </button>

            {/* JUSTIFY */}

            <button
              type="button"
              title="По ширине"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand(
                  "justifyFull"
                );
              }}
              className={toolbarButton}
            >
              ≡≡
            </button>

            <div
              className="
                mx-1
                hidden
                h-6
                w-px
                bg-gray-200
                sm:block
              "
            />

            {/* UL */}

            <button
              type="button"
              title="Маркированный список"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand(
                  "insertUnorderedList"
                );
              }}
              className={toolbarButton}
            >
              • Список
            </button>

            {/* OL */}

            <button
              type="button"
              title="Нумерованный список"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand(
                  "insertOrderedList"
                );
              }}
              className={toolbarButton}
            >
              1. Список
            </button>

            {/* QUOTE */}

            <button
              type="button"
              title="Цитата"
              onMouseDown={(e) => {
                e.preventDefault();
                formatBlock(
                  "blockquote"
                );
              }}
              className={toolbarButton}
            >
              “ ”
            </button>

            {/* HR */}

            <button
              type="button"
              title="Горизонтальная линия"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand(
                  "insertHorizontalRule"
                );
              }}
              className={toolbarButton}
            >
              ―
            </button>

            {/* LINK */}

            <button
              type="button"
              title="Добавить ссылку"
              onMouseDown={(e) => {
                e.preventDefault();
                addLink();
              }}
              className={toolbarButton}
            >
              🔗 Ссылка
            </button>

            {/* HTML INSERT */}

            <button
              type="button"
              title="Вставить HTML"
              onMouseDown={(e) => {
                e.preventDefault();
                insertHtml();
              }}
              className={toolbarButton}
            >
              &lt;/&gt;
            </button>

            {/* CLEAR */}

            <button
              type="button"
              title="Очистить форматирование"
              onMouseDown={(e) => {
                e.preventDefault();
                clearFormatting();
              }}
              className="
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                px-3
                py-2
                text-xs
                font-semibold
                text-gray-600
                hover:bg-red-50
                hover:text-red-600
              "
            >
              Очистить
            </button>

          </div>


          {/* =================================================
              VISUAL EDITOR
          ================================================= */}

          <div className="p-4">

            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onPaste={handlePaste}
              onFocus={() => {
                setFocused(true);
              }}
              onBlur={() => {
                saveSelection();
                setFocused(false);
              }}
              onMouseUp={saveSelection}
              onKeyUp={saveSelection}
              className="
                seo-editor
                min-h-130
                w-full
                overflow-y-auto
                rounded-xl
                border
                border-gray-200
                bg-white
                px-6
                py-5
                text-[15px]
                leading-7
                text-gray-800
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10

                [&_h1]:mb-4
                [&_h1]:mt-6
                [&_h1]:text-3xl
                [&_h1]:font-bold
                [&_h1]:text-gray-900

                [&_h2]:mb-3
                [&_h2]:mt-7
                [&_h2]:text-2xl
                [&_h2]:font-bold
                [&_h2]:text-gray-900

                [&_h3]:mb-2
                [&_h3]:mt-5
                [&_h3]:text-xl
                [&_h3]:font-bold
                [&_h3]:text-gray-900

                [&_p]:mb-4

                [&_ul]:my-4
                [&_ul]:list-disc
                [&_ul]:pl-6

                [&_ol]:my-4
                [&_ol]:list-decimal
                [&_ol]:pl-6

                [&_li]:mb-1

                [&_blockquote]:my-5
                [&_blockquote]:border-l-4
                [&_blockquote]:border-blue-300
                [&_blockquote]:bg-blue-50
                [&_blockquote]:px-4
                [&_blockquote]:py-3
                [&_blockquote]:italic

                [&_a]:text-blue-600
                [&_a]:underline

                [&_hr]:my-6
                [&_hr]:border-gray-200

                [&_table]:my-5
                [&_table]:w-full
                [&_table]:border-collapse

                [&_td]:border
                [&_td]:border-gray-300
                [&_td]:p-2

                [&_th]:border
                [&_th]:border-gray-300
                [&_th]:bg-gray-100
                [&_th]:p-2
              "
              data-placeholder={
                isCreate
                  ? "Начните писать SEO-текст..."
                  : "Введите подробный информационный текст..."
              }
            />

            <div
              className="
                mt-3
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
              "
            >

              <span
                className="
                  text-xs
                  text-gray-400
                "
              >
                Можно вставлять форматированный текст
                из Word, Google Docs и других редакторов.
              </span>

              <span
                className="
                  text-xs
                  text-gray-400
                "
              >
                Рекомендуется от 3000 символов
              </span>

            </div>

          </div>
        </>
      )}

    </div>
  );
}


// =====================================================
// ОСНОВНОЙ КОМПОНЕНТ
// =====================================================

export default function AdminCategories() {
  const {
    categories,
    fetchCategories,
    updateCategory: updateCategoryStore,
    addCategory,
    removeCategory,
    loading,
  } = useCategoryStore();


  // =====================================================
  // СОЗДАНИЕ
  // =====================================================

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [seoText, setSeoText] = useState("");
  const [creating, setCreating] = useState(false);


  // =====================================================
  // РЕДАКТИРОВАНИЕ
  // =====================================================

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingSeoText, setEditingSeoText] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [editingPreview, setEditingPreview] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);


  // =====================================================
  // ОТКРЫТЫЕ ГЛАВНЫЕ КАТЕГОРИИ
  // =====================================================

  const [openCategories, setOpenCategories] =
    useState({});


  // =====================================================
  // ЗАГРУЗКА
  // =====================================================

  useEffect(() => {
    fetchCategories(true);
  }, [fetchCategories]);


  // =====================================================
  // ГЛАВНЫЕ КАТЕГОРИИ
  // =====================================================

  const mainCategories = useMemo(() => {
    return categories.filter(
      (category) => !category.parent
    );
  }, [categories]);


  // =====================================================
  // ПОДКАТЕГОРИИ
  // =====================================================

  const getChildren = (parentId) => {
    return categories.filter((category) => {
      const categoryParent =
        category.parent?._id ||
        category.parent;

      return (
        categoryParent &&
        String(categoryParent) ===
          String(parentId)
      );
    });
  };


  // =====================================================
  // ОТКРЫТЬ / ЗАКРЫТЬ
  // =====================================================

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  // =====================================================
  // ВЫБОР КАРТИНКИ ПРИ СОЗДАНИИ
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };


  // =====================================================
  // СОЗДАНИЕ КАТЕГОРИИ
  // =====================================================

  const handleCreate = async (e) => {
    e.preventDefault();

    const categoryName = name.trim();

    if (!categoryName) {
      alert("Введите название");
      return;
    }

    setCreating(true);

    try {
      let imageUrl = "";

      // -------------------------------------------------
      // Загрузка изображения
      // -------------------------------------------------

      if (image) {
        const response =
          await uploadImage(image);

        imageUrl = response.data.url;
      }


      // -------------------------------------------------
      // Создание категории
      // -------------------------------------------------

      const { data } =
        await createCategory({
          name: categoryName,
          image: imageUrl,
          parent: parentId || null,
          seoText,
        });


      addCategory(data);


      // -------------------------------------------------
      // Сброс формы
      // -------------------------------------------------

      setName("");
      setParentId("");
      setImage(null);
      setImagePreview("");
      setSeoText("");


      const input =
        document.getElementById(
          "category-image"
        );

      if (input) {
        input.value = "";
      }


      // -------------------------------------------------
      // Открываем родителя
      // -------------------------------------------------

      if (parentId) {
        setOpenCategories((prev) => ({
          ...prev,
          [parentId]: true,
        }));
      }

    } catch (error) {
      console.error(
        "Ошибка создания категории:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Не удалось создать категорию"
      );

    } finally {
      setCreating(false);
    }
  };


  // =====================================================
  // НАЧАТЬ РЕДАКТИРОВАНИЕ
  // =====================================================

  const handleEditStart = (category) => {
    setEditingId(category._id);

    setEditingName(
      category.name || ""
    );

    setEditingSeoText(
      category.seoText || ""
    );

    setEditingImage(null);

    setEditingPreview(
      category.image || ""
    );
  };


  // =====================================================
  // ОТМЕНА
  // =====================================================

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
    setEditingSeoText("");
    setEditingImage(null);
    setEditingPreview("");
  };


  // =====================================================
  // НОВАЯ КАРТИНКА
  // =====================================================

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setEditingImage(file);

    setEditingPreview(
      URL.createObjectURL(file)
    );
  };


  // =====================================================
  // СОХРАНЕНИЕ
  // =====================================================

  const handleEditSave = async (id) => {
    const cleanName =
      editingName.trim();

    if (!cleanName) {
      alert("Введите название");
      return;
    }

    setSavingEdit(true);

    try {
      let imageUrl =
        editingPreview;


      // -------------------------------------------------
      // Новое изображение
      // -------------------------------------------------

      if (editingImage) {
        const response =
          await uploadImage(
            editingImage
          );

        imageUrl =
          response.data.url;
      }


      // -------------------------------------------------
      // Категория
      // -------------------------------------------------

      const category =
        categories.find(
          (item) =>
            String(item._id) ===
            String(id)
        );

      if (!category) {
        throw new Error(
          "Категория не найдена в списке"
        );
      }


      // -------------------------------------------------
      // Родитель
      // -------------------------------------------------

      const parentId =
        category.parent?._id ||
        category.parent ||
        null;


      // -------------------------------------------------
      // Сохраняем
      // -------------------------------------------------

      const { data } =
        await updateCategory(
          id,
          {
            name: cleanName,
            image: imageUrl,
            parent: parentId,
            seoText:
              editingSeoText,
          }
        );


      // -------------------------------------------------
      // Обновляем store
      // -------------------------------------------------

      updateCategoryStore(data);


      // -------------------------------------------------
      // Родителя оставляем открытым
      // -------------------------------------------------

      if (parentId) {
        setOpenCategories(
          (prev) => ({
            ...prev,
            [parentId]: true,
          })
        );
      }


      handleEditCancel();

    } catch (error) {
      console.error(
        "Ошибка изменения категории:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Не удалось изменить категорию"
      );

    } finally {
      setSavingEdit(false);
    }
  };


  // =====================================================
  // УДАЛЕНИЕ
  // =====================================================

  const handleDelete = async (
    id,
    categoryName
  ) => {
    const children =
      getChildren(id);

    if (children.length > 0) {
      alert(
        `Нельзя удалить "${categoryName}", пока у неё есть ${children.length} подкатегорий. Сначала удалите подкатегории.`
      );

      return;
    }


    const confirmed =
      window.confirm(
        `Удалить "${categoryName}"?`
      );

    if (!confirmed) return;


    try {
      await deleteCategory(id);

      removeCategory(id);

    } catch (error) {
      console.error(
        "Ошибка удаления:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Не удалось удалить категорию"
      );
    }
  };


  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h2
          className="
            text-2xl
            font-bold
            text-gray-900
          "
        >
          Категории
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          Управление главными категориями,
          подкатегориями и информационными
          текстами
        </p>
      </div>


      {/* =================================================
          СОЗДАНИЕ
      ================================================= */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
        "
      >

        <div
          className="
            border-b
            border-gray-100
            px-6
            py-5
          "
        >
          <h3
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            Добавить категорию
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Здесь можно сразу добавить название,
            изображение и большой информационный
            текст.
          </p>
        </div>


        <form
          onSubmit={handleCreate}
          className="space-y-6 p-6"
        >

          {/* ТИП */}

          <div>
            <label
              htmlFor="type"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Тип категории
            </label>

            <select
              id="type"
              name="type"
              value={parentId}
              onChange={(e) =>
                setParentId(
                  e.target.value
                )
              }
              className="
                h-12
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                outline-none
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-500/10
              "
            >

              <option value="">
                Главная категория
              </option>

              {mainCategories.map(
                (category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    ↳ Подкатегория:{" "}
                    {category.name}
                  </option>
                )
              )}

            </select>
          </div>


          {/* НАЗВАНИЕ */}

          <div>
            <label
              htmlFor="name"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Название
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              autoComplete="off"
              maxLength={100}
              placeholder={
                parentId
                  ? "Например: Телефоны"
                  : "Например: Электроника"
              }
              className="
                h-12
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                outline-none
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-500/10
              "
            />
          </div>


          {/* ИЗОБРАЖЕНИЕ */}

          <div>
            <label
              htmlFor="category-image"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              {parentId
                ? "Изображение подкатегории"
                : "Изображение главной категории"}
            </label>

            <input
              id="category-image"
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              className="
                block
                w-full
                text-sm
              "
            />

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt=""
                  className="
                    h-28
                    w-48
                    rounded-xl
                    border
                    border-gray-200
                    object-cover
                  "
                />
              </div>
            )}
          </div>


          {/* SEO */}

          <SeoEditor
            value={seoText}
            onChange={setSeoText}
            isCreate
          />


          {/* КНОПКА */}

          <div className="pt-2">

            <button
              type="submit"
              disabled={creating}
              className="
                h-12
                rounded-xl
                bg-blue-600
                px-6
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                disabled:bg-gray-300
              "
            >
              {creating
                ? "Добавление..."
                : parentId
                  ? "Добавить подкатегорию"
                  : "Добавить главную категорию"}
            </button>

          </div>

        </form>
      </section>


      {/* =================================================
          СПИСОК
      ================================================= */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
        "
      >

        {/* HEADER */}

        <div
          className="
            border-b
            border-gray-100
            p-5
          "
        >
          <h3
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            Структура категорий
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Главных категорий:{" "}
            <b>{mainCategories.length}</b>
            {" · "}
            Всего категорий:{" "}
            <b>{categories.length}</b>
          </p>
        </div>


        {/* LOADING */}

        {loading ? (
          <div
            className="
              p-8
              text-center
              text-gray-500
            "
          >
            Загрузка...
          </div>

        ) : mainCategories.length === 0 ? (
          <div
            className="
              p-8
              text-center
              text-gray-500
            "
          >
            Категорий пока нет
          </div>

        ) : (

          <div className="space-y-3 p-4">

            {mainCategories.map(
              (parent) => {
                const children =
                  getChildren(
                    parent._id
                  );

                const isOpen =
                  openCategories[
                    parent._id
                  ];

                const isEditing =
                  editingId ===
                  parent._id;

                return (
                  <div
                    key={parent._id}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-gray-200
                    "
                  >

                    {/* =================================================
                        MAIN CATEGORY
                    ================================================= */}

                    <div
                      className={
                        isEditing
                          ? "bg-white"
                          : "bg-gray-50"
                      }
                    >

                      {/* ОСНОВНАЯ СТРОКА */}

                      <div
                        className="
                          flex
                          items-center
                          gap-4
                          p-4
                        "
                      >

                        {/* IMAGE */}

                        {parent.image ? (
                          <img
                            src={parent.image}
                            alt={parent.name}
                            className="
                              h-14
                              w-20
                              shrink-0
                              rounded-xl
                              border
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-14
                              w-20
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-blue-100
                              text-xl
                              font-bold
                              text-blue-600
                            "
                          >
                            {parent.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}


                        {/* NAME */}

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          {!isEditing ? (
                            <>

                              <div
                                className="
                                  flex
                                  flex-wrap
                                  items-center
                                  gap-2
                                "
                              >

                                <span
                                  className="
                                    text-lg
                                    font-bold
                                    text-gray-900
                                  "
                                >
                                  {parent.name}
                                </span>

                                <span
                                  className="
                                    rounded-md
                                    bg-blue-100
                                    px-2
                                    py-1
                                    text-[10px]
                                    font-bold
                                    text-blue-700
                                  "
                                >
                                  ГЛАВНАЯ
                                </span>

                                {parent.seoText?.trim() && (
                                  <span
                                    className="
                                      rounded-md
                                      bg-green-100
                                      px-2
                                      py-1
                                      text-[10px]
                                      font-bold
                                      text-green-700
                                    "
                                  >
                                    SEO-ТЕКСТ
                                  </span>
                                )}

                              </div>

                              <div
                                className="
                                  mt-1
                                  text-xs
                                  text-gray-400
                                "
                              >
                                Подкатегорий:{" "}
                                {children.length}
                              </div>

                            </>
                          ) : (
                            <span
                              className="
                                text-sm
                                font-medium
                                text-gray-500
                              "
                            >
                              Редактирование
                              категории
                            </span>
                          )}

                        </div>


                        {/* BUTTONS */}

                        {isEditing ? (

                          <div
                            className="
                              flex
                              shrink-0
                              gap-2
                            "
                          >

                            <button
                              type="button"
                              disabled={
                                savingEdit
                              }
                              onClick={() =>
                                handleEditSave(
                                  parent._id
                                )
                              }
                              className="
                                rounded-xl
                                bg-green-600
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                hover:bg-green-700
                                disabled:opacity-50
                              "
                            >
                              {savingEdit
                                ? "..."
                                : "Сохранить"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                savingEdit
                              }
                              onClick={
                                handleEditCancel
                              }
                              className="
                                rounded-xl
                                bg-gray-100
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-gray-700
                                hover:bg-gray-200
                                disabled:opacity-50
                              "
                            >
                              Отмена
                            </button>

                          </div>

                        ) : (

                          <div
                            className="
                              flex
                              shrink-0
                              items-center
                              gap-2
                            "
                          >

                            {children.length > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  toggleCategory(
                                    parent._id
                                  )
                                }
                                className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-xl
                                  border
                                  border-gray-200
                                  bg-white
                                  text-gray-500
                                  hover:text-blue-600
                                "
                              >
                                <span
                                  className={`
                                    text-xl
                                    transition-transform
                                    ${
                                      isOpen
                                        ? "rotate-90"
                                        : ""
                                    }
                                  `}
                                >
                                  ›
                                </span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                handleEditStart(
                                  parent
                                )
                              }
                              className="
                                rounded-xl
                                bg-blue-50
                                px-3
                                py-2
                                text-sm
                                font-medium
                                text-blue-600
                              "
                            >
                              Изменить
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  parent._id,
                                  parent.name
                                )
                              }
                              className="
                                rounded-xl
                                bg-red-50
                                px-3
                                py-2
                                text-sm
                                font-medium
                                text-red-600
                              "
                            >
                              Удалить
                            </button>

                          </div>

                        )}

                      </div>


                      {/* =================================================
                          РЕДАКТИРОВАНИЕ MAIN
                      ================================================= */}

                      {isEditing && (
                        <div
                          className="
                            space-y-5
                            px-5
                            pb-5
                            pt-1
                          "
                        >

                          {/* NAME */}

                          <div>
                            <label
                              className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-gray-800
                              "
                            >
                              Название категории
                            </label>

                            <input
                              value={
                                editingName
                              }
                              onChange={(e) =>
                                setEditingName(
                                  e.target.value
                                )
                              }
                              autoFocus
                              className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                                px-4
                                outline-none
                                focus:border-blue-500
                                focus:bg-white
                                focus:ring-4
                                focus:ring-blue-500/10
                              "
                            />
                          </div>


                          {/* IMAGE */}

                          <div>
                            <label
                              className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-gray-800
                              "
                            >
                              Изображение
                            </label>

                            <input
                              type="file"
                              accept="image/*"
                              onChange={
                                handleEditImageChange
                              }
                              className="
                                block
                                w-full
                                text-sm
                              "
                            />

                            {editingPreview && (
                              <img
                                src={
                                  editingPreview
                                }
                                alt=""
                                className="
                                  mt-3
                                  h-28
                                  w-48
                                  rounded-xl
                                  border
                                  border-gray-200
                                  object-cover
                                "
                              />
                            )}
                          </div>


                          {/* SEO */}

                          <SeoEditor
                            value={
                              editingSeoText
                            }
                            onChange={
                              setEditingSeoText
                            }
                          />

                        </div>
                      )}

                    </div>


                    {/* =================================================
                        CHILDREN
                    ================================================= */}

                    {isOpen &&
                      children.length > 0 && (
                        <div
                          className="
                            border-t
                            border-gray-200
                            bg-white
                          "
                        >

                          {children.map(
                            (child) => {

                              const isChildEditing =
                                editingId ===
                                child._id;

                              return (
                                <div
                                  key={
                                    child._id
                                  }
                                  className="
                                    border-b
                                    border-gray-100
                                    last:border-b-0
                                  "
                                >

                                  {/* CHILD ROW */}

                                  <div
                                    className="
                                      flex
                                      items-center
                                      gap-4
                                      px-5
                                      py-3
                                    "
                                  >

                                    {/* ARROW */}

                                    <div
                                      className="
                                        w-8
                                        shrink-0
                                        text-center
                                        text-lg
                                        text-gray-300
                                      "
                                    >
                                      ↳
                                    </div>


                                    {/* IMAGE */}

                                    {child.image ? (
                                      <img
                                        src={
                                          child.image
                                        }
                                        alt={
                                          child.name
                                        }
                                        className="
                                          h-12
                                          w-16
                                          shrink-0
                                          rounded-lg
                                          border
                                          border-gray-200
                                          object-cover
                                        "
                                      />
                                    ) : (
                                      <div
                                        className="
                                          flex
                                          h-12
                                          w-16
                                          shrink-0
                                          items-center
                                          justify-center
                                          rounded-lg
                                          bg-gray-100
                                          text-lg
                                          font-bold
                                          text-gray-500
                                        "
                                      >
                                        {child.name
                                          .charAt(
                                            0
                                          )
                                          .toUpperCase()}
                                      </div>
                                    )}


                                    {/* NAME */}

                                    <div
                                      className="
                                        min-w-0
                                        flex-1
                                      "
                                    >

                                      {!isChildEditing ? (
                                        <div
                                          className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                          "
                                        >

                                          <span
                                            className="
                                              font-medium
                                              text-gray-800
                                            "
                                          >
                                            {
                                              child.name
                                            }
                                          </span>

                                          <span
                                            className="
                                              rounded-md
                                              bg-gray-100
                                              px-2
                                              py-1
                                              text-[10px]
                                              text-gray-500
                                            "
                                          >
                                            ПОДКАТЕГОРИЯ
                                          </span>

                                          {child.seoText?.trim() && (
                                            <span
                                              className="
                                                rounded-md
                                                bg-green-100
                                                px-2
                                                py-1
                                                text-[10px]
                                                font-bold
                                                text-green-700
                                              "
                                            >
                                              SEO-ТЕКСТ
                                            </span>
                                          )}

                                        </div>
                                      ) : (
                                        <span
                                          className="
                                            text-sm
                                            font-medium
                                            text-gray-500
                                          "
                                        >
                                          Редактирование
                                          подкатегории
                                        </span>
                                      )}

                                    </div>


                                    {/* BUTTONS */}

                                    <div
                                      className="
                                        flex
                                        shrink-0
                                        gap-2
                                      "
                                    >

                                      {!isChildEditing ? (
                                        <>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleEditStart(
                                                child
                                              )
                                            }
                                            className="
                                              rounded-xl
                                              bg-blue-50
                                              px-3
                                              py-2
                                              text-sm
                                              font-medium
                                              text-blue-600
                                            "
                                          >
                                            Изменить
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDelete(
                                                child._id,
                                                child.name
                                              )
                                            }
                                            className="
                                              rounded-xl
                                              bg-red-50
                                              px-3
                                              py-2
                                              text-sm
                                              font-medium
                                              text-red-600
                                            "
                                          >
                                            Удалить
                                          </button>

                                        </>
                                      ) : (
                                        <>

                                          <button
                                            type="button"
                                            disabled={
                                              savingEdit
                                            }
                                            onClick={() =>
                                              handleEditSave(
                                                child._id
                                              )
                                            }
                                            className="
                                              rounded-xl
                                              bg-green-600
                                              px-4
                                              py-2
                                              text-sm
                                              font-medium
                                              text-white
                                              hover:bg-green-700
                                              disabled:opacity-50
                                            "
                                          >
                                            {savingEdit
                                              ? "..."
                                              : "Сохранить"}
                                          </button>

                                          <button
                                            type="button"
                                            disabled={
                                              savingEdit
                                            }
                                            onClick={
                                              handleEditCancel
                                            }
                                            className="
                                              rounded-xl
                                              bg-gray-100
                                              px-4
                                              py-2
                                              text-sm
                                              font-medium
                                              text-gray-700
                                              hover:bg-gray-200
                                              disabled:opacity-50
                                            "
                                          >
                                            Отмена
                                          </button>

                                        </>
                                      )}

                                    </div>

                                  </div>


                                  {/* =================================================
                                      CHILD EDIT
                                  ================================================= */}

                                  {isChildEditing && (
                                    <div
                                      className="
                                        ml-12
                                        space-y-5
                                        px-5
                                        pb-5
                                        pt-1
                                      "
                                    >

                                      {/* NAME */}

                                      <div>
                                        <label
                                          className="
                                            mb-2
                                            block
                                            text-sm
                                            font-semibold
                                            text-gray-800
                                          "
                                        >
                                          Название
                                          подкатегории
                                        </label>

                                        <input
                                          value={
                                            editingName
                                          }
                                          onChange={(
                                            e
                                          ) =>
                                            setEditingName(
                                              e.target
                                                .value
                                            )
                                          }
                                          className="
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            px-4
                                            outline-none
                                            focus:border-blue-500
                                            focus:bg-white
                                            focus:ring-4
                                            focus:ring-blue-500/10
                                          "
                                        />
                                      </div>


                                      {/* IMAGE */}

                                      <div>
                                        <label
                                          className="
                                            mb-2
                                            block
                                            text-sm
                                            font-semibold
                                            text-gray-800
                                          "
                                        >
                                          Изображение
                                          подкатегории
                                        </label>

                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={
                                            handleEditImageChange
                                          }
                                          className="
                                            block
                                            w-full
                                            text-sm
                                          "
                                        />

                                        {editingPreview && (
                                          <img
                                            src={
                                              editingPreview
                                            }
                                            alt=""
                                            className="
                                              mt-3
                                              h-28
                                              w-48
                                              rounded-xl
                                              border
                                              border-gray-200
                                              object-cover
                                            "
                                          />
                                        )}
                                      </div>


                                      {/* SEO */}

                                      <SeoEditor
                                        value={
                                          editingSeoText
                                        }
                                        onChange={
                                          setEditingSeoText
                                        }
                                      />

                                    </div>
                                  )}

                                </div>
                              );
                            }
                          )}

                        </div>
                      )}

                  </div>
                );
              }
            )}

          </div>
        )}

      </section>

    </div>
  );
}
