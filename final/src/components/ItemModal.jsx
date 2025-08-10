import { useState, useEffect, useRef} from "react";
import "../styles/browse.css";

function ItemModal({item, onClose}) {

    const dialogRef = useRef(null);

    useEffect(() => {

        const dialog = dialogRef.current;

        if (!dialog) return;

        if (item) {
            if (typeof dialog.showModal === "function") {
                dialog.showModal();
            } else {
                dialog.setAttribute("open", "");
            }
        } else if (dialog.open) {
            dialog.Close();
        }
    }, [item]);

    return (

        <dialog
            ref={dialogRef}
            onClose={onClose}
            aria-labelledby="item-modal-title"
            className="item-modal"
        >
            <form method="dialog" className="modal-inner">
                <header className="modal-header">
                    <h3 id="item-modal-title"> {item.name} </h3>
                    <button
                        type="submit"
                        className="modal-close"
                        aria-label="Close details"

                    >
                        ❌
                    </button>
                </header>

                <div className="modal-content">
                    <div className="modal-media">
                        <img
                            src={item.photo || "/placeholder.png"}
                            alt={item.photo ? item.name : `${item.name} (no photo)`}
                        />

                    </div>

                    <dl className="modal-details">
                        <dt>Location</dt>
                        <dd>{item.location}</dd>
                    </dl>


                </div>
            </form>



        </dialog>

    )

}

export default ItemModal;