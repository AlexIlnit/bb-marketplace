// import { approveListing, rejectListing, deleteListing } from "../../api/adminApi";

// export function ListingsTable({ listings, reload }) {
//   return (
//     <div className="space-y-4">

//       {listings.map((l) => (
//         <div
//           key={l._id}
//           className="bg-white p-4 rounded-xl shadow-sm flex justify-between"
//         >

//           <div>
//             <p className="font-bold">{l.title}</p>
//             <p className="text-sm text-gray-500">
//               {l.price} BYN • {l.status}
//             </p>
//           </div>

//           <div className="flex gap-2">

//             <button
//               onClick={async () => {
//                 await approveListing(l._id);
//                 reload();
//               }}
//               className="bg-green-600 text-white px-3 py-1 rounded"
//             >
//               Approve
//             </button>

//             <button
//               onClick={async () => {
//                 await rejectListing(l._id);
//                 reload();
//               }}
//               className="bg-yellow-500 text-white px-3 py-1 rounded"
//             >
//               Reject
//             </button>

//             <button
//               onClick={async () => {
//                 await deleteListing(l._id);
//                 reload();
//               }}
//               className="bg-red-600 text-white px-3 py-1 rounded"
//             >
//               Delete
//             </button>

//           </div>
//         </div>
//       ))}

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getAllListings, deleteListing } from "../../api/listingApi";

export default function AdminListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await getAllListings();
    setListings(data);
  };

  const remove = async (id) => {
    await deleteListing(id);
    setListings((prev) => prev.filter((i) => i._id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Listings
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th>Price</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {listings.map((l) => (
              <tr key={l._id} className="border-t">

                <td className="p-3">{l.title}</td>
                <td>{l.price}</td>
                <td>{l.city}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => remove(l._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}
