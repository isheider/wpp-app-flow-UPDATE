interface INavBar {
  title?: string;
  back?: string;
  editable?: boolean;
  editableInitialValue?: string;
  editableValueChangeHandle?: string;
}

import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

import { FaPencilAlt, FaCheck } from "react-icons/fa";
import { FiEdit2, FiSave } from "react-icons/fi";
import { useState } from "react";

const EditableText = ({ initialValue, onSave }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialValue);

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex items-center">
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border text-xl  h-10 font-semibold border-gray-300 p-1 rounded-md"
        />
      ) : (
        <span className="text-xl h-10  flex items-center leading-none font-semibold">
          {text}
        </span>
      )}
      <button
        onClick={isEditing ? handleSave : handleToggleEdit}
        className="ml-2 w-8 h-8 bg-orange-500 text-base text-white rounded-full flex items-center justify-center focus:outline-none hover:bg-orange-600"
      >
        {isEditing ? <FaCheck /> : <FaPencilAlt />}
      </button>
    </div>
  );
};
const NavBar: React.FC<INavBar> = ({
  title,
  editable,
  editableValueChangeHandle,
  editableInitialValue,
  back,
}) => {
  return (
    <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center">
          {back && (
            <Link to={back}>
              <FaArrowLeft className="mr-4" size={22} />
            </Link>
          )}
          <span
            className="text-xl pb-[4px]
leading-none font-semibold whitespace-nowrap dark:text-white"
          >
            {editable ? (
              <EditableText
                initialValue={editableInitialValue}
                onSave={editableValueChangeHandle}
              />
            ) : title ? (
              title
            ) : (
              "BotSimples"
            )}
          </span>
        </div>
        <button
          data-collapse-toggle="navbar-solid-bg"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-solid-bg"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Fluxos
              </a>
            </li>

            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Sair
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
