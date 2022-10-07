import { useState, useMemo, useRef } from "react";
import { AiFillInfoCircle } from 'react-icons/ai';
import { useAppSelector } from "../../../../redux";
import { Advertising } from "../../../../services";
import { notifyError } from "../../../utils";
import safeplaceImg from './../../../../assets/image/safeplace.jpeg';
import log from "loglevel";

const DragDropFile: React.FC<{
  handleFile: (file: File) => void;
}> = ({
  handleFile
}) => {
  const inputRef = useRef<any>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const handleFiles = (files: FileList) => {
    setSelectedFile(files[0]);
    handleFile(files[0]);
  };

  const handleDrag = (event: React.ChangeEvent<any>) =>  {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) =>  {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleChange = (event: React.ChangeEvent<any>) =>  {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      handleFiles(event.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <form className="relative h-12 w-56 text-center border border-solid rounded-lg border-neutral-400" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
      <button className={`w-full h-full rounded-lg truncate ${dragActive ? 'bg-white' : 'bg-neutral-200'}`} onClick={onButtonClick}>
        {selectedFile !== undefined ? selectedFile.name : 'Choisir une image...'}
      </button>
      { dragActive &&
        <div
          className="absolute z-10 w-full h-full rounded-lg bg-transparent top-0 left-0 right-0 bottom-0"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      }
    </form>
  );
};

const CommercialCampaignCreationStepFour: React.FC<{
  prevStepClick: () => void;
  nextStepClick: () => void;
  targetIds: string[];
}> = ({
  prevStepClick,
  nextStepClick,
  targetIds,
}) => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const placeholderTitle = useMemo(() => "Le titre de votre publicité", []);
  const placeholderDescription = useMemo(() => "Une description de votre établissement ou de l'évènement que vous souhaitez promouvoir.", []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadImage, setUploadImage] = useState("");

  const handleClick = async () => {
    try {
      await Advertising.create({
        id: "",
        title: title,
        ownerId: userCredentials._id,
        targets: targetIds,
        imageUrl: uploadImage,
        description: description,
      }, userCredentials.token);

      nextStepClick();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  return (
    <div className="flex-auto bg-white rounded-lg shadow-xl border border-solid border-neutral-100">
      <div className="mx-auto w-1/2 my-12" style={{ minWidth: "38rem" }}>
        <div className="relative">
          <div className="absolute grid grid-cols-5 bg-neutral-200 rounded-lg h-3 w-1/3 left-1/2 -translate-x-1/2">
            <div className="col-span-4 bg-blue-500 rounded-lg"></div>
          </div>
          <p className="text-center font-bold text-3xl pt-6">Votre publicité</p>
          <div className="grid grid-cols-2 text-neutral-500 my-10">
            <div>
              <input
                type="text"
                className="border border-solid border-neutral-400 rounded-lg px-4 py-2 w-full"
                placeholder="Titre"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <p className="text-sm mb-3">Le titre de la publicité</p>

              <textarea
                className="border border-solid border-neutral-400 rounded-lg px-4 py-2 w-full"
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <p className="text-sm mb-3">La description de la publicité</p>

              <DragDropFile handleFile={(file) => setUploadImage(URL.createObjectURL(file))} />
              <p className="text-sm mb-3">Formats acceptées: .png, .jpeg, .jpg</p>

            </div>
            <div className="px-4 space-y-10">

              <div className="relative w-full h-24 bg-neutral-200 rounded-2xl pt-3 pb-6 px-4 drop-shadow-lg">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <img src={uploadImage !== "" ? uploadImage : safeplaceImg} alt="" className="-translate-y-1/2 w-full" />
                </div>
                <AiFillInfoCircle className="absolute bottom-0 left-10 translate-y-1/2 w-7 h-7 text-neutral-300" />
                <button className="absolute bottom-0 right-10 translate-y-1/2 bg-neutral-300 text-neutral-600 text-sm font-bold p-1 rounded-xl">
                  Y ALLER
                </button>
              </div>

              <div className="relative w-full h-24 bg-neutral-200 rounded-2xl pt-3 pb-6 px-4 drop-shadow-lg">
                <p className="text-sm font-bold">{title !== "" ? title : placeholderTitle}</p>
                <p className="text-sm ">{description !== "" ? description : placeholderDescription}</p>
                <AiFillInfoCircle className="absolute bottom-0 left-10 translate-y-1/2 w-7 h-7 text-neutral-400" />
                <button className="absolute bottom-0 right-10 translate-y-1/2 bg-neutral-300 text-neutral-600 text-sm font-bold p-1 rounded-xl">
                  Y ALLER
                </button>
              </div>

            </div>
          </div>

          <div>
            <hr className="my-6" />
            <button className="text-lg font-bold text-blue-500 bg-white hover:text-blue-400 px-6 py-2 rounded-lg float-left" onClick={prevStepClick}>
              RETOUR
            </button>
            <button className="text-lg font-bold text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-lg float-right" onClick={handleClick}>
              CONTINUER
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommercialCampaignCreationStepFour;