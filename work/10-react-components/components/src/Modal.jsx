import { useRef, useEffect, useState} from "react";
import Button from "./Button";
import  './Modal.css';

function Modal({isOpen, onClose}) {
    const dialogRef = useRef();
    const [submitted, setSubmitted] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const dialog = dialogRef.current;

        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal()
            }
        } else {
            if (dialog.open) {
                dialog.close();
            }
        }

    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
          setSubmitted(false);
          setInputValue("");
        }
      }, [isOpen]);


      const handleClose = () => {

        onClose();
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
      };

    return (

    <dialog ref={dialogRef} className="modal">
      <div className="modal-content">
        <h2> Leave us a message here.  </h2>
        <p> Please fill out the form below and we’ll get back to you. </p>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="demo-input">Your Message:</label>
            <input
              type="text"
              id="demo-input"
              name="demo-input"
              placeholder="Type something..."
              required
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <Button type="submit" visual="link">
              Submit Form
            </Button>
            <Button type="button" visual="button" onClick={handleClose}>
              Close Modal
            </Button>
          </div>
        </form>

        {submitted && (
          <p className="submit-feedback">✅ Your form has been submitted!</p>
        )}
      </div>
    </dialog>
    )
}
export default Modal;