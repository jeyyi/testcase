import React, { useState, useRef } from "react";

interface Contact {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]); // State to manage contacts
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [validationError, setValidationError] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = (contact?: Contact) => {
    setSelectedContact(contact || null);

    if (modalRef.current) {
      modalRef.current.showModal();
      setIsModalOpen(true);
      // Set initial values for the form based on whether it's an "Add Contact" or "Edit Contact" operation
      if (contact) {
        setName(contact.name);
        setEmail(contact.email);
        setContactNumber(contact.contactNumber);
      } else {
        // Reset form for "Add Contact" operation
        setName("");
        setEmail("");
        setContactNumber("");
      }
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
      setIsModalOpen(false);
      // Reset form values and validation error on close
      setName("");
      setEmail("");
      setContactNumber("");
      setValidationError("");
    }
  };

  const handleSaveContact = (newContact: Contact) => {
    const { name, email, contactNumber } = newContact;

    // Validation checks
    if (!name.trim() || !email.trim() || !contactNumber.trim()) {
      setValidationError("Please fill in all fields.");
      return;
    }

    // Check if the email is in a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    // Check if the contact number is in a valid format
    const validContactNumber =
      /^\+\d{12}$/.test(contactNumber) || /^\d{11}$/.test(contactNumber);
    if (!validContactNumber) {
      setValidationError("Please enter a valid contact number.");
      return;
    }

    if (selectedContact) {
      // Editing existing contact
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === selectedContact.id ? newContact : contact
        )
      );
    } else {
      // Adding new contact
      setContacts((prevContacts) => [
        ...prevContacts,
        { ...newContact, id: Date.now() },
      ]);
    }

    setValidationError(""); // Reset validation error after a successful save
    closeModal();
  };

  const handleDeleteContact = (contactId: number) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== contactId)
    );
  };
  return (
    <>
      {/* Modal for opening add contact */}
      {/* Modal */}
      <dialog id="addcontactmodal" className="modal" ref={modalRef}>
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-2xl">
            {selectedContact ? "Edit Contact" : "Add Contact"}
          </h3>
          <div className="w-full flex flex-col justify-center items-center mt-5">
            <div className="rounded-full bg-gray-400 w-20 h-20" />
            <div className="w-full">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Enter Full Name</span>
                </div>
              </label>
              <input
                type="text"
                placeholder="Type here"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-full">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Enter Email</span>
                </div>
              </label>
              <input
                type="text"
                placeholder="email@email.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Enter Contact Number</span>
                </div>
              </label>
              <input
                type="text"
                placeholder="+63"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          {validationError && (
            <p className="text-red-500 mt-2">{validationError}</p>
          )}

          <button
            className="btn rounded-full bg-indigo-950 shadow-xl mt-5 w-40 text-white"
            onClick={() =>
              handleSaveContact({
                id: selectedContact?.id || 0,
                name: name,
                email: email,
                contactNumber: contactNumber,
              })
            }
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </span>
            Save
          </button>
        </div>
      </dialog>
      {/* Header */}
      <div className="w-full h-fit lg:py-5 lg:px-10 p-5 flex bg-gray-50">
        <h1 className="font-bold flex-1">All Contacts ({contacts.length})</h1>
        <div className="flex gap-5"></div>
      </div>
      <div className="divider -mt-2" />
      <div className="w-full flex lg:px-10 justify-between gap-5 px-5">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered rounded-full input-md max-w-xs"
        />
        <button
          className="btn bg-indigo-950 text-white rounded-full"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => openModal()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Add Contact
        </button>
      </div>
      {/* Table for contacts */}
      <div className="overflow-x-auto p-5">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-bold">{contact.name}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {contact.email}
                  <br />
                </td>
                <td>{contact.contactNumber}</td>
                <th>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => openModal(contact)}
                  >
                    edit
                  </button>
                </th>
                <th>
                  <button
                    title="delete button"
                    className="btn-xs text-red-500 hover:text-indigo-950"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Action</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default App;
