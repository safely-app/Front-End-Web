import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { Comment } from "../../../services";
import { SearchBar, Table } from "../../common";
import IComment from "../../interfaces/IComment";
import { notifyError } from "../../utils";
import log from "loglevel";

enum ModalType {
  CREATE,
  OFF
}

const CustomDiv: React.FC<{
  content: JSX.Element | string;
}> = ({
  content
}) => {
  return (
    <div className='table-cell border-t-2 border-solid border-neutral-300'>
      {content}
    </div>
  );
};

const CommentMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [comments, setComments] = useState<IComment[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModalOn] = useState(ModalType.OFF);
  const [modalTypes, setModalTypes] = useState<ModalType[]>([]);

  const keys = [
    { displayedName: 'ID DE PROPRIÉTAIRE', displayFunction: (comment: IComment, index: number) => <CustomDiv key={'tbl-val-' + index} content={comment.userId} /> },
    { displayedName: 'ID DE SAFEPLACE', displayFunction: (comment: IComment, index: number) => <CustomDiv key={'tbl-val-' + index} content={comment.safeplaceId} /> },
    { displayedName: 'COMMENTAIRE', displayFunction: (comment: IComment, index: number) => <CustomDiv key={'tbl-val-' + index} content={comment.comment} /> },
    { displayedName: 'NOTE', displayFunction: (comment: IComment, index: number) => <CustomDiv key={'tbl-val-' + index} content={String(comment.grade)} /> },
    { displayedName: 'ÉTAT DE VALIDATION', displayFunction: (comment: IComment, index: number) => <CustomDiv key={'tbl-val-' + index} content={comment.hasBeenValidated ? "TRUE" : "FALSE"} /> },
    { displayedName: 'ID', displayFunction: (comment: IComment, index: number) => <CustomDiv key={'tbl-val-' + index} content={comment.id} /> },
    { displayedName: 'ACTION', displayFunction: (comment: IComment, index: number) =>
      <CustomDiv key={'tbl-val-' + index} content={
        <div className="ml-3 flex space-x-2">
          <button onClick={() => {}}><BsPencilSquare /></button>
          <button onClick={() => {}}><ImCross /></button>
        </div>
      } />
    },
  ];

  const setModal = (modalType: ModalType) => {
    setModalTypes([ ...modalTypes, modalType ]);
    setModalOn(modalType);
  };

  useEffect(() => {
    Comment.getAll(userCredentials.token)
      .then(result => {
        const gotComments: IComment[] = result.data.map(comment => ({
          id: comment._id,
          userId: comment.userId,
          safeplaceId: comment.safeplaceId,
          comment: comment.comment,
          grade: comment.grade,
          hasBeenValidated: comment.hasBeenValidated
        }) as IComment);

        setComments(gotComments);
      }).catch(error => {
        log.error(error);
        notifyError(error);
      });
  }, [userCredentials]);

  return (
    <div className='my-3'>

      <SearchBar
        placeholder='Rechercher un commentaire...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table content={comments} keys={keys} />
      </div>
    </div>
  );
};

export default CommentMonitor;