const style = {
  // Main.jsx
  body: "relative overflow-hidden bg-gray-100 text-gray-900 min-h-screen",
  signOutButtonSection: "w-full grid grid-cols-4 my-8",
  myGroupsButton:
    "col-start-2 w-fit h-fit mx-auto bg-blue-400 hover:bg-blue-700 text-white p-2 rounded-md ease-in-out duration-300",
  signOutButton:
    "w-fit h-fit mx-auto self-center bg-red-400 hover:bg-red-700 text-white p-2 rounded-md ease-in-out duration-300",

  // Header.jsx
  header: "w-full text-center grid grid-cols-2 p-4",
  siteHeader: "text-xl align-center text-left font-bold cursor-pointer",
  buttonGenerator:
    "w-fit h-fit justify-self-end self-center bg-blue-400 hover:bg-blue-700 text-white p-2 rounded-md ease-in-out duration-300",

  hamburger:
    "w-10 h-10 mx-2 self-center grid grid-cols-1 bg-gray-200 border border-gray-400 text-white rounded-md ease-in-out duration-300",
  hamburgerLineContainer: "w-full self-center",
  line: "w-6 h-1 mx-auto bg-gray-400 my-1 rounded-md",

  // Hamburger.jsx
  menu: "fixed top-0 right-0 h-full bg-white transform transition-transform duration-300 ease-in-out",
  menuOpen: "-translate-x-0",
  menuClosed: "-translate-x-full",
  overlay: "fixed inset-0 z-50",

  closeMenu:
    "w-10 h-10 mx-2 self-center grid grid-cols-1 bg-gray-200 border border-gray-400 text-white rounded-md ease-in-out duration-300",
  closeLineL:
    "w-6 h-1 mx-auto bg-gray-400 my-1 rounded-md transform -rotate-45 translate-y-[13px]",
  closeLineR:
    "w-6 h-1 mx-auto bg-gray-400 my-1 rounded-md transform rotate-45 -translate-y-[6px]",
  menuHeader: "col-start-2 text-xl font-bold p-4",

  menuList: "w-screen text-center grid grid-cols-1 gap-4 my-4",
  menuItems: "h-screen w-full my-20",
  menuItem:
    "text-xl my-10 cursor-pointer align-center ease-in-out duration-300",

  // AiGenerator.jsx
  buttonLog:
    "w-fit h-fit mx-auto self-center bg-blue-400 hover:bg-blue-700 text-white p-2 rounded-md ease-in-out duration-300",

  promptSection: "w-full text-center grid grid-cols-1 gap-4 my-4",
  promptHeader: "text-md font-bold p-4",
  promptArea: "w-2/3 mx-auto rounded-md min-h-24",
  buttonGenerate:
    "w-fit h-fit mx-auto bg-blue-400 hover:bg-blue-700 text-white p-2 rounded-md",

  requestStatus: "text-center text-sm font-bold",

  responseSection: "w-full text-center grid grid-cols-1 gap-4 my-4",
  responseHeader: "text-md font-bold p-4",
  responseArea: "w-2/3 mx-auto rounded-md min-h-24",

  // ShoppingList.jsx
  selectSection: "w-full text-center grid grid-cols-1 gap-4 my-4",
  selectGroup: "grid grid-cols-1 gap-2 col-start-1 col-span-1",
  selectGroupDropdown:
    "w-2/3 mx-auto rounded-md h-10 px-2 border border-gray-400",

  productSection: "w-full text-center",
  productGroupSection: "w-2/3 mx-auto grid grid-cols-1 my-4",
  listHeaderGroup: "text-md font-bold",
  listHeaderParticipants: "text-md text-center",
  listHeaderList: "text-xl text-center py-4 col-start-1 col-span-2",

  productForm: "w-full mx-auto my-4",
  productInput: "rounded-md h-10 px-2 mr-1 border border-gray-400",
  productAddButton:
    "w-20 h-fit mx-auto bg-blue-400 hover:bg-blue-700 text-white p-2 ml-1 rounded-md ease-in-out duration-300",

  list: "w-2/3 mx-auto px-2 py-0 grid grid-cols-1 gap-4 my-4 bg-gray-200 rounded-md border border-gray-400",
  listHeader: "text-md text-center font-bold py-4 align-center",
  listEmpty: "w-full text-center text-gray-500 text-md font-bold p-4",

  itemSection: "w-full text-center flex my-4",
  item: "w-full text-left mr-2 flex bg-gray-100 hover:bg-white rounded-md p-2 ease-in-out duration-300",
  itemName: "ml-2 text-md",
  itemRemove:
    "w-fit h-10 mx-auto bg-red-400 hover:bg-red-700 text-white px-2 rounded-md ease-in-out duration-300",

  // Login.jsx
  loginSection: "w-full text-center grid grid-cols-1 gap-4 mt-20",
  loginForm: "w-2/3 mx-auto",
  link: "text-blue-400 hover:text-blue-700 cursor-pointer ease-in-out duration-300",

  // SignUpForm.jsx & SignInForm.jsx
  loginHeader: "text-xl font-bold text-center my-4",
  loginInput: "rounded-md h-10 px-2 mr-1 border border-gray-400 my-1",
  loginButton:
    "w-20 h-fit mx-auto bg-blue-400 hover:bg-blue-700 text-white p-2 ml-1 rounded-md my-4 ease-in-out duration-300",

  // CreateGroup.jsx
  groupForm: "w-2/3 mx-auto",
  groupHeader: "text-xl text-center my-4",
  groupInput: "rounded-md w-full h-10 px-2 border border-gray-400",

  participantSection: "w-full text-center flex mt-2",
  participantInputSection: "w-full grid grid-cols-1",
  participantContainer: "w-full flex mb-2",
  participantInput: "rounded-md w-full h-10 px-2 border border-gray-400",
  removeParticipantButton:
    "w-fit h-10 mx-auto bg-red-400 hover:bg-red-700 text-white px-2 mr-1 rounded-md ease-in-out duration-300",
  addParticipantButton:
    "w-fit h-10 mx-auto bg-green-400 hover:bg-green-700 text-white px-2 ml-1 rounded-md ease-in-out duration-300",

  groupButtonContainer: "w-full mt-2 flex",
  groupButton:
    "w-fit h-fit mx-auto bg-blue-400 hover:bg-blue-700 text-white p-2 rounded-md ease-in-out duration-300",
  notification: "w-full text-xl text-center my-6 text-green-400",

  // GroupList.jsx
  groupListSection:
    "w-4/5 mx-auto px-2 my-4 bg-gray-200 rounded-md border border-gray-400",
  groupList: "w-full mx-auto px-2 py-0 grid grid-cols-1 gap-4 my-4",
  groupListItem: "w-full my-2 ",
  groupListButton:
    "w-full h-fit mx-auto text-left p-2 bg-gray-100 hover:bg-white rounded-md ease-in-out duration-300",
  groupSection: "font-bold text-md",
  participantsSection: "w-full text-center flex pl-2",
  listSection:
    "mt-2 w-full h-fit mx-auto bg-blue-400 hover:bg-blue-700 text-white p-2 rounded-md ease-in-out duration-300",
  addListSection:
    "mt-2 w-full h-fit mx-auto bg-green-400 hover:bg-green-700 text-white p-2 rounded-md ease-in-out duration-300",

  editHeader: "text-left flex align-center",
  removeGroupButton:
    "w-fit h-10 bg-red-400 hover:bg-red-700 text-white px-2 mr-2 rounded-md ease-in-out duration-300",

  // CreateList.jsx
  createListSection: "w-full flex mt-2",

  editModeButton:
    "w-fit h-fit mx-auto bg-blue-400 hover:bg-blue-700 text-white p-2 rounded-md ease-in-out duration-300 mb-2",

  createListInput: "rounded-md w-full h-10 px-2 border border-gray-400 mr-2",
  createListButton:
    "w-fit h-10 mx-auto bg-green-400 hover:bg-green-700 text-white px-2 rounded-md ease-in-out duration-300",

  // Group.jsx
  signOutButtonSectionGroup: "w-full grid grid-cols-1 my-8",

  // Logs.jsx
  dataSection: "w-full text-center my-4",
  dataHeader: "text-md font-bold p-4",

  chartSection: "w-full text-center grid grid-cols-1 gap-4 my-4",

  downloadSection: "w-full text-center grid grid-cols-3 gap-4 my-4",
  logsButton:
    "col-start-2 w-fit h-fit mx-auto bg-blue-400 hover:bg-blue-700 text-white p-2 rounded-md ease-in-out duration-300",
};

export default style;
