import IComment from "../../interfaces/IComment";

export const CommentModal: React.FC<{
  title: string;
  modalOn: boolean;
  comment: IComment;
  setComment: (comment: IComment) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  comment,
  setComment,
  buttons
}) => {
  const setField = (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setComment({
      ...comment,
      [key]: event.target.value
    });
  };

  return (
    <div className='absolute bg-white z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='text' placeholder='Commentaire' className='block m-2 w-60 text-sm' value={comment.comment || ''} onChange={(event) => setField('comment', event)} />
      <input type='text' placeholder='Note' className='block m-2 w-60 text-sm' value={comment.grade || ''} onChange={(event) => setField('grade', event)} />
      <label className='text-sm mx-2'>Validation</label>
      <input type='checkbox' onChange={() => setComment({ ...comment, hasBeenValidated: !comment.hasBeenValidated })} checked={comment.hasBeenValidated || false} />
      <input type='text' placeholder='ID de safeplace' className='block m-2 w-60 text-sm' value={comment.safeplaceId || ''} onChange={(event) => setField('safeplaceId', event)} />
      <input type='text' placeholder='ID de propriétaire' className='block m-2 w-60 text-sm' value={comment.userId || ''} onChange={(event) => setField('userId', event)} />
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </div>
  );
};