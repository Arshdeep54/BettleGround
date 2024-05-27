// import { ReactNode, useRef } from "react";
// import { Modal } from "./Modal";

// export const useModal = ({
//   children,
//   modalBoxClassName,
//   shouldAllowBackdropClick = true,
//   onModalClose,
//   onModalOpen,
// }) => {
//   const ref = (useRef < HTMLDialogElement) | (null > null);

//   const closeModal = () => {
//     onModalClose && onModalClose();
//     ref.current?.close();
//   };

//   const openModal = () => {
//     onModalOpen && onModalOpen();
//     ref.current?.showModal();
//   };

//   const modal = (
//     <Modal
//       onBackdropClick={() => {
//         if (shouldAllowBackdropClick) {
//           closeModal();
//         }
//       }}
//       ref={ref}
//       modalBoxClassName={modalBoxClassName}
//     >
//       {children}
//     </Modal>
//   );

//   return {
//     modal,
//     closeModal,
//     openModal,
   
//   };
// };
