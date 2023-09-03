import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "../services/api";
import { useNodeData } from "../contexts/NodeDataContext";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function MidiaUploadModal() {
  const {
    nodeData,
    setNodeData,
    currentUploadModalId,
    currentUploadType: currentTab,
    showUploadModal,
    setShowUploadModal,
  }: any = useNodeData();

  const [uploads, setUploads] = useState<any>({});

  async function handleClose() {
    setShowUploadModal(false);
  }

  const [loading, setLoading] = useState(true);

  const { id, checkSession } = useAuth();
  const { templateId } = useParams();

  const navigate = useNavigate();

  // Carregar os uploads quando o componente é montado
  useEffect(() => {
    if (templateId && checkSession) {
      if (!id) {
        navigate("/login");
      } else {
        const fetchData = async () => {
          try {
            setLoading(true);
            const res = await api.get("/get-profile-uploads"); // Ajuste a URL conforme necessário
            setUploads(res.data);
            setLoading(false);
          } catch (err) {
            console.error(err);
            setUploads({});
            setLoading(false);
          }
        };

        fetchData();
      }
    }
  }, [templateId, checkSession, id]);

  // Função para exibir os checkboxes com base no tipo de mídia selecionado
  const renderCheckboxes = (
    type: any,
    toggleUploadSelection: any,
    selectedUploads: any
  ) => {
    const uploadsOfType = uploads[type] ?? [];

    return uploadsOfType.map((upload: any) => (
      <div
        className={`${
          selectedUploads[upload._id] ? "bg-blue-100" : ""
        } flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700`}
      >
        <input
          id={`bordered-checkbox-${upload._id}`}
          type="checkbox"
          checked={selectedUploads[upload._id] || false}
          onChange={() => toggleUploadSelection(upload._id)}
          className="w-4 h-4 text-blue-600   rounded  focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
        />
        <label
          htmlFor={`bordered-checkbox-${upload._id}`}
          className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          <a
            target="_blank"
            className="underline"
            href={`${
              import.meta.env.VITE_API_URL ?? "http://localhost:3333"
            }/get-upload-url/${upload._id}`}
          >
            {upload.filename}
          </a>
        </label>
      </div>
    ));
  };

  const [selectedUploads, setSelectedUploads] = useState({});

  useEffect(() => {
    if (nodeData[currentUploadModalId]?.content?.midias) {
      setSelectedUploads(nodeData[currentUploadModalId]?.content?.midias);
    } else {
      setSelectedUploads({});
    }
  }, [currentUploadModalId, nodeData[currentUploadModalId]?.content?.midias]);

  const modalRef: any = useRef();

  const handleClickOutside = (event: any) => {
    if (modalRef.current === event.target) {
      handleClose();
    }
  };

  const toggleUploadSelection = (uploadId: any) => {
    setSelectedUploads((prevState: any) => {
      const payload = {
        ...prevState,
        [uploadId]: !prevState[uploadId],
      };

      const newData = {
        ...nodeData,
        [currentUploadModalId]: {
          ...nodeData[currentUploadModalId],
          content: {
            ...nodeData[currentUploadModalId]?.content,
            midias: payload,
            mediaType: currentTab,
          },
        },
      };
      setNodeData(newData);

      return payload;
    });
  };

  const renderUploads = () => {
    if (currentTab === "all") {
      return Object.keys(uploads).map((type) =>
        renderCheckboxes(type, toggleUploadSelection, selectedUploads)
      );
    }
    return renderCheckboxes(currentTab, toggleUploadSelection, selectedUploads);
  };

  const onDrop = useCallback(
    async (acceptedFiles: any) => {
      // Cria um novo objeto FormData
      setLoading(true);
      const formData = new FormData();

      // Adiciona os arquivos ao objeto FormData
      acceptedFiles.forEach((file: any) => {
        formData.append("file", file);
      });

      // Adiciona o tipo ao objeto FormData
      formData.append("type", currentTab);

      try {
        // Envia os dados para o endpoint

        const res = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Atualiza o estado dos uploads
        setUploads((prevState: any) => {
          return {
            ...prevState,
            [currentTab]: [...prevState[currentTab], ...res.data],
          };
        });
        toast.success(
          "Sucesso ao enviar arquivo(s). Agora você pode selecioná-los "
        );
        setLoading(false);
      } catch (err) {
        // Exibe uma mensagem de erro
        setLoading(false);
        toast.error("Erro ao enviar arquivo(s). Tente novamente mais tarde.");
      }
    },
    [currentTab]
  );

  // Configurações do dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept:
      currentTab === "image"
        ? { "image/jpg": [".jpg", ".jpeg"], "image/png": [".png"] }
        : currentTab === "video"
        ? { "video/*": [] }
        : currentTab === "audio"
        ? { "audio/*": [] }
        : currentTab === "recording"
        ? {
            "audio/ogg": [".ogg"],
            "audio/mp4": [".mp4"],
            "video/mp4": [".mp4"],
          }
        : currentTab === "others"
        ? { "*/*": [] }
        : {},
  });

  return (
    <>
      <div
        id="defaultModal"
        ref={modalRef}
        onClick={handleClickOutside}
        className={`${
          showUploadModal ? "" : "hidden"
        } fixed flex items-center justify-center bg-zinc-800/30 top-0 left-0 right-0 z-40 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100%] max-h-full`}
      >
        <div className="z-50 relative w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {(() => {
                  switch (currentTab) {
                    case "image":
                      return "Selecione 1 ou mais imagens";
                    case "video":
                      return "Selecione 1 ou mais vídeos";
                    case "audio":
                      return "Selecione 1 ou mais áudios (enviados como música)";
                    case "recording":
                      return "Selecione 1 ou mais gravações de áudios";
                    case "others":
                      return "Selecione 1 ou mais documentos";
                  }
                })()}
              </h3>
              <button
                type="button"
                onClick={() => handleClose()}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="defaultModal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {loading ? (
              <>
                <Oval
                  height={80}
                  width={80}
                  color="blue"
                  wrapperStyle={{}}
                  wrapperClass="p-8"
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="blue"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              </>
            ) : (
              <>
                {renderUploads()}

                <div className="flex items-center p-4 justify-center w-full">
                  <div className="flex items-center p-4 justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      {...getRootProps()}
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">
                            Clique para enviar
                          </span>{" "}
                          ou arraste e solte
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(() => {
                            switch (currentTab) {
                              case "image":
                                return ".PNG OU .JPG (MAX. 10mb)";
                              case "video":
                                return "ARQUIVOS DE VÍDEO (MAX. 10mb)";
                              case "audio":
                                return "ARQUIVOS DE ÁUDIO (MAX. 10mb)";
                              case "recording":
                                return ".OGG OU .MP4 (APENAS) (MAX. 10mb)";
                              case "others":
                                return "DOCUMENTOS (MAX. 10mb)";
                            }
                          })()}
                        </p>
                      </div>
                      <input
                        {...getInputProps()}
                        multiple
                        type="file"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    data-modal-hide="defaultModal"
                    type="button"
                    onClick={handleClose}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Pronto
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// function MidiaUploadModalContainer() {

//   return showUploadModal ? (
//     <MidiaUploadModal
//       handleClose={handleClose}
//       uploads={uploads}
//       setUploads={setUploads}
//       renderCheckboxes={renderCheckboxes}
//     />
//   ) : (
//     <></>
//   );
// }

export default MidiaUploadModal;
