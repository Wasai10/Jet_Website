import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const jetSwal = Swal.mixin({
  background: "#001726",
  color: "#ffffff",
  backdrop: "rgba(0, 0, 0, 0.75)",
  buttonsStyling: false,
  customClass: {
    popup: "jet-swal-popup",
    title: "jet-swal-title",
    htmlContainer: "jet-swal-content",
    confirmButton: "jet-swal-confirm",
    cancelButton: "jet-swal-cancel",
  },
});

export default jetSwal;
