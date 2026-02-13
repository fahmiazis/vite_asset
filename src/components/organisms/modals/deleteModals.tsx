import { useDeleteModalStore } from "../../../stores/useDeleteModal";
import Buttons from "../../atoms/buttons";
import Images from "../../atoms/images";

interface ModalProps {
  label1?: string;
  label2?: string;
  handleSubmit?: () => void;
  onClickLabel1?: () => void;
  ilustration?: string;
  title?: string;
  desc?: string;
}

export default function DeleteModals({
  label1 = "Batal",
  label2 = "Ya, Hapus",
  handleSubmit,
  onClickLabel1,
  ilustration,
  title,
  desc,
}: ModalProps) {
  const { closeModal, label } = useDeleteModalStore();
  const handleClose = () => {
    closeModal();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={handleClose}
      />
      <div className="bg-white rounded-lg w-xl md:max-w-2/5 mx-4 p-6 z-10 text-center">
        {ilustration && (
          <section className="w-full flex justify-center">
            <Images src={ilustration} />
          </section>
        )}
        <h5 className="font-semibold text-lg">{title ? title : `Are you sure to Delete ${label}`}</h5>
        <p className="font-light max-w-2/3 mx-auto">{desc}</p>
        <section className="w-full flex gap-4 mt-4">
          <Buttons
            className="w-full"
            label={label1}
            onClick={() => {
              if (onClickLabel1) {
                onClickLabel1();
              } else {
                handleClose();
              }
            }}
          />
          <Buttons
            className="w-full"
            label={label2}
            onClick={handleSubmit}
          />
        </section>
      </div>
    </div>
  );
}