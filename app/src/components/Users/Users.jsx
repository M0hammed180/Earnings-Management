import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../Elements/Loading";
import { FiXCircle } from "react-icons/fi";

export default function Users() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [editFormData, setEditFormData] = useState({
    username: "",
    name: "",
    phone: "",
    role: "",
    expiresAt: "",
  });

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:3000/user");
    setUsers(response.data.allUsers);
  };

  useEffect(() => {
    fetchUsers()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filterUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditFormData({
      username: user.username,
      name: user.name,
      phone: user.phone,
      role: user.role,
      expiresAt: new Date(user.expiresAt).toISOString().split("T")[0],
    });
  };

  const handleSaveClick = async () => {
    try {
      await axios.put("http://localhost:3000/user", {
        ...editFormData,
        userId: editUserId,
      });
      setEditUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/user/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) return <Loading />;

  const inputClass =
    "w-full min-w-28 rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 outline-none focus:border-gray-600";

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-800 sm:p-5">
      <div className=" w-full flex justify-center mb-3">
        <div className="relative text-gray-600">
          <input
            type="text"
            name="serch"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
          />
          <button
            type="submit"
            onClick={() => setSearch("")}
            className="absolute right-0 top-0 mt-3 mr-4 cursor-pointer"
          >
            {search.length > 0 ? (
              <FiXCircle />
            ) : (
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                viewBox="0 0 56.966 56.966"
                style={{ enableBackground: "new 0 0 56.966 56.966" }}
                xmlSpace="preserve"
                width="512px"
                height="512px"
              >
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <section className="mx-auto max-w-7xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <h1 className="mb-4 text-lg font-bold text-gray-900">Users</h1>
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="min-w-200 w-full border-collapse text-left text-sm">
            <thead className="bg-gray-700 text-white">
              <tr>
                {[
                  "Username",
                  "Name",
                  "Phone",
                  "Role",
                  "Expires At",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap p-3 font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filterUsers.map((user) => {
                const isEditing = editUserId === user._id;
                return (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 align-middle hover:bg-gray-50"
                  >
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          name="username"
                          value={editFormData.username}
                          onChange={(event) =>
                            setEditFormData({
                              ...editFormData,
                              username: event.target.value,
                            })
                          }
                          className={inputClass}
                        />
                      ) : (
                        user.username
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          name="name"
                          value={editFormData.name}
                          onChange={(event) =>
                            setEditFormData({
                              ...editFormData,
                              name: event.target.value,
                            })
                          }
                          className={inputClass}
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          name="phone"
                          value={editFormData.phone}
                          onChange={(event) =>
                            setEditFormData({
                              ...editFormData,
                              phone: event.target.value,
                            })
                          }
                          className={inputClass}
                        />
                      ) : (
                        user.phone
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <select
                          name="role"
                          value={editFormData.role}
                          onChange={(event) =>
                            setEditFormData({
                              ...editFormData,
                              role: event.target.value,
                            })
                          }
                          className={inputClass}
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    <td className="whitespace-nowrap p-3">
                      {isEditing ? (
                        <input
                          type="date"
                          name="expiresAt"
                          value={editFormData.expiresAt}
                          onChange={(event) =>
                            setEditFormData({
                              ...editFormData,
                              expiresAt: event.target.value,
                            })
                          }
                          className={inputClass}
                        />
                      ) : (
                        new Date(user.expiresAt).toISOString().split("T")[0]
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveClick}
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditUserId(null)}
                              className="rounded-lg bg-gray-600 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(user)}
                              className="rounded-lg bg-gray-600 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="rounded bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
