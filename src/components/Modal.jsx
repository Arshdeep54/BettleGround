// import { forwardRef, ReactNode } from 'react'



// export const Modal = forwardRef<HTMLDialogElement>(
//   ({ children, modalBoxClassName, onBackdropClick }, ref) => {
//     return (
//       <dialog ref={ref} className="modal">
//         <div className={`modal-box ${modalBoxClassName ?? ''}`}>{children}</div>
//         <form method="dialog" className="modal-backdrop">
//           <button
//             type="button"
//             onClick={() => {
//               onBackdropClick && onBackdropClick()
//             }}
//           >
//             close
//           </button>
//         </form>
//       </dialog>
//     )
//   }
// )