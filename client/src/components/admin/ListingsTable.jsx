import { approveListing, rejectListing, deleteListing } from "../../api/adminApi";

export default function ListingsTable({ listings, reload }) {
  return (
    <div className="space-y-4">

      {listings.map((l) => (
        <div
          key={l._id}
          className="bg-white p-4 rounded-xl shadow-sm flex justify-between"
        >

          <div>
            <p className="font-bold">{l.title}</p>
            <p className="text-sm text-gray-500">
              {l.price} BYN • {l.status}
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={async () => {
                await approveListing(l._id);
                reload();
              }}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Approve
            </button>

            <button
              onClick={async () => {
                await rejectListing(l._id);
                reload();
              }}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>

            <button
              onClick={async () => {
                await deleteListing(l._id);
                reload();
              }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>

          </div>
        </div>
      ))}

    </div>
  );
}