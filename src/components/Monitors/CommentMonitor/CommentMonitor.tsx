import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAppSelector } from "../../../redux";
import { Comment } from "../../../services";
import { SearchBar, Table } from "../../common";
import IComment from "../../interfaces/IComment";
import { convertStringToRegex, notifyError, notifySuccess } from "../../utils";
import { CommentModal } from "./CommentMonitorModal";
import { CustomDiv } from "../../common/Table";
import { ModalBtn } from "../../common/Modal";
import { ModalType } from "../ModalType";
import log from "loglevel";

const CommentMonitor: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [comments, setComments] = useState<IComment[]>([]);
  const [checkedBoxes, setCheckedBoxes] = useState<number[]>([]);
  const [textSearch, setTextSearch] = useState("");
  const [modalOn, setModal] = useState(ModalType.OFF);

  const [comment, setComment] = useState<IComment>({
    id: "",
    comment: "",
    grade: 0,
    safeplaceId: "",
    userId: "",
    hasBeenValidated: false
  });

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
          <button data-testid={'uc-btn-' + index} onClick={() => updateModal(comment, ModalType.UPDATE)}><BsPencilSquare /></button>
          <button data-testid={'dc-btn-' + index} onClick={() => deleteComment(comment)}><ImCross /></button>
        </div>
      } />
    },
  ];

  const filterComments = (): IComment[] => {
    const lowerSearchText = convertStringToRegex(textSearch.toLocaleLowerCase());

    if (textSearch === '') {
      return comments;
    }

    return comments
      .filter(comment => textSearch !== ''
        ? comment.comment.toLowerCase().match(lowerSearchText) !== null
        || comment.safeplaceId.toLowerCase().match(lowerSearchText) !== null
        || comment.userId.toLowerCase().match(lowerSearchText) !== null
        || comment.grade.toString().toLowerCase().match(lowerSearchText) !== null
        || comment.id.toLowerCase().match(lowerSearchText) !== null : true);
  };

  const updateModal = (comment: IComment, modalType: ModalType) => {
    setModal(modalType);
    setComment(comment);
  };

  const createComment = async (comment: IComment) => {
    try {
      const newComment = { ...comment, adminId: userCredentials._id };
      const result = await Comment.create(newComment, userCredentials.token);

      setComments([ ...comments, { ...newComment, id: result.data._id } ]);
      notifySuccess("Nouvelle cible créée");
      setModal(ModalType.OFF);
      resetComment();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const updateComment = async (comment: IComment) => {
    try {
      await Comment.update(comment.id, comment, userCredentials.token);
      setComments(comments.map(c => (c.id === comment.id) ? comment : c));
      notifySuccess("Modifications enregistrées");
      setModal(ModalType.OFF);
      resetComment();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const deleteComment = async (comment: IComment) => {
    try {
      const checkedCommentIds = checkedBoxes.map(checkedIndex => comments[checkedIndex].id);

      if (!checkedCommentIds.includes(comment.id))
        checkedCommentIds.push(comment.id);

      for (const commentId of checkedCommentIds) {
        Comment.delete(commentId, userCredentials.token)
          .catch(err => log.error(err));
      }

      setCheckedBoxes([]);
      setComments(comments.filter(c => !checkedCommentIds.includes(c.id)));
      notifySuccess(
        (checkedCommentIds.length > 1)
          ? "Commentaires supprimées"
          : "Commentaire supprimée"
      );
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const resetComment = () => {
    setComment({
      id: "",
      comment: "",
      grade: 0,
      safeplaceId: "",
      userId: "",
      hasBeenValidated: false
    });
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

      <CommentModal
        title='Créer un nouveau commentaire'
        modalOn={modalOn === ModalType.CREATE}
        comment={comment}
        setComment={setComment}
        buttons={[
          <ModalBtn key='ccm-0' content='Créer un commentaire' onClick={() => createComment(comment)} />,
          <ModalBtn key='ccm-1' content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetComment();
          }} />
        ]}
      />

      <CommentModal
        title='Modifier un commentaire'
        modalOn={modalOn === ModalType.UPDATE}
        comment={comment}
        setComment={setComment}
        buttons={[
          <ModalBtn key='ucm-0' content='Modifier le commentaire' onClick={() => updateComment(comment)} />,
          <ModalBtn key='ucm-1' content='Annuler' onClick={() => {
            setModal(ModalType.OFF);
            resetComment();
          }} />
        ]}
      />

      <SearchBar
        placeholder='Rechercher un commentaire...'
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        openCreateModal={() => setModal(ModalType.CREATE)}
      />
      <div className='mt-3'>
        <Table
          content={filterComments()}
          keys={keys}
          checkedBoxes={checkedBoxes}
          setCheckedBoxes={setCheckedBoxes}
        />
      </div>
    </div>
  );
};

export default CommentMonitor;