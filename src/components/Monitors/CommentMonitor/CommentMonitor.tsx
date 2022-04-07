import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux";
import IComment from "../../interfaces/IComment";
import ISafeplace from "../../interfaces/ISafeplace";
import { Comment, Safeplace } from "../../../services";
import { convertStringToRegex, notifyError } from "../../utils";
import { FaStar, FaRegStar } from 'react-icons/fa';
import {
    Dropdown,
    SearchBar,
    Modal,
    TextInput,
    Button
} from "../../common";
import log from "loglevel";

interface ICommentInfoFormProps {
    comment: IComment;
    setComment: (comment: IComment) => void;
    buttons: JSX.Element[];
}

const CommentInfoForm: React.FC<ICommentInfoFormProps> = ({
    comment,
    setComment,
    buttons
}) => {
    const setGrade = (grade: string) => {
        setComment({ ...comment, grade: Number(grade) });
    };

    const setContent = (content: string) => {
        setComment({ ...comment, comment: content });
    };

    return (
        <Modal shown={true} content={
            <div className="p-4 m-4 align-">
                <div className="m-auto" style={{ width: '60%' }}>
                    <p className="text-gray-500 text-left">Identifiant du commentaire</p>
                    <TextInput type="text" role="id" className="w-full"
                        label="Identifiant du commentaire" value={comment.id} setValue={() => {}} readonly />
                    <p className="text-gray-500 text-left">Identifiant du créateur</p>
                    <TextInput type="text" role="userId" className="w-full"
                        label="Identifiant du créateur" value={comment.userId} setValue={() => {}} readonly />
                    <p className="text-gray-500 text-left">Identifiant de la safeplace</p>
                    <TextInput type="text" role="safeplaceId" className="w-full"
                        label="Identifiant de la safeplace" value={comment.safeplaceId} setValue={() => {}} readonly />
                    <div className="mt-2"></div>
                    <Dropdown defaultValue={String(comment.grade)} width="100%"
                        values={[ '1', '2', '3', '4', '5' ]} setValue={setGrade} />
                    <textarea className="w-full mt-2" value={comment.comment} onChange={(e) => setContent(e.target.value)} />
                    {buttons}
                </div>
            </div>
        } />
    );
};

interface ICommentInfoDisplayerProps {
    comment: IComment;
    safeplace: ISafeplace | undefined;
    onClick: (comment: IComment) => void;
}

const CommentInfoDisplayer: React.FC<ICommentInfoDisplayerProps> = ({
    comment,
    safeplace,
    onClick
}) => {
    const getShortText = (text: string, size: number = 30): string => {
        return `${text.slice(0, size)}${text.length > size ? '...' : ''}`;
    };

    return (
        <div className="bg-white p-4 rounded">
            <button className="w-full h-full" onClick={() => onClick(comment)}>
                <ul className="text-left w-full h-full">
                    <li key={`${comment.id}-userId`}><b>User ID : </b>{comment.userId}</li>
                    <li key={`${comment.id}-safeplaceId`}><b>Safeplace ID : </b>{comment.safeplaceId}</li>
                    <li key={`${comment.id}-safeplace-name`} hidden={!!!safeplace}><b>Nom de la safeplace : </b>{getShortText(`${safeplace?.name} - ${safeplace?.city}`)}</li>
                    <li key={`${comment.id}-comment`}><b>Commentaire : </b>{getShortText(comment.comment)}</li>
                    <li key={`${comment.id}-grade`}>
                        <ul className="inline-block">
                            {[ 1, 2, 3, 4, 5 ].map(index =>
                                <li key={`${comment.id}-grade-${index}`} className="float-left text-yellow-300">
                                    {(comment.grade >= index) ? <FaStar /> : <FaRegStar />}
                                </li>
                            )}
                        </ul>
                    </li>
                </ul>
            </button>
        </div>
    );
};

interface ICommentMonitorFilterProps {
    searchBarValue: string;
    setDropdownValue: (value: string) => void;
    setSearchBarValue: (value: string) => void;
}

const CommentMonitorFilter: React.FC<ICommentMonitorFilterProps> = ({
    searchBarValue,
    setDropdownValue,
    setSearchBarValue
}) => {
    const COMMENT_GRADES = [
        'all',
        '1',
        '2',
        '3',
        '4',
        '5'
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 md:grid-rows-1 px-4">
            <Dropdown width="10em" defaultValue="all" values={COMMENT_GRADES} setValue={setDropdownValue} />
            <SearchBar label="Rechercher un commentaire" value={searchBarValue} setValue={setSearchBarValue} />
        </div>
    );
};

const CommentMonitor: React.FC = () => {
    const userCredentials = useAppSelector(state => state.user.credentials);
    const [focusComment, setFocusComment] = useState<IComment | undefined>(undefined);
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);
    const [comments, setComments] = useState<IComment[]>([]);
    const [commentGrade, setCommentGrade] = useState("all");
    const [searchText, setSearchText] = useState("");

    const getSafeplace = (safeplaceId: string): ISafeplace | undefined => {
        return safeplaces.find(safeplace => safeplace.id === safeplaceId);
    };

    const setComment = (comment: IComment) => {
        setComments(comments.map(commentElement => commentElement.id === comment.id ? comment : commentElement));
    };

    const removeComment = (comment: IComment) => {
        setComments(comments.filter(commentElement => commentElement.id !== comment.id));
    };

    const saveCommentModification = async (comment: IComment) => {
        try {
            await Comment.update(comment.id, comment, userCredentials.token);
            setComment(focusComment as IComment);
            setFocusComment(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const deleteComment = async (comment: IComment) => {
        try {
            await Comment.delete(comment.id, userCredentials.token);
            removeComment(comment);
            setFocusComment(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const filterComments = (): IComment[] => {
        const lowerSearchText = convertStringToRegex(searchText.toLocaleLowerCase());

        if (searchText === "" && commentGrade === "all")
            return comments;
        return comments
            .filter(comment => commentGrade !== "all" ? String(comment.grade) === commentGrade : true)
            .filter(comment => comment.id.toLowerCase().match(lowerSearchText) !== null
                || comment.userId.toLowerCase().match(lowerSearchText) !== null
                || comment.safeplaceId.toLowerCase().match(lowerSearchText) !== null
                || comment.comment.toLowerCase().match(lowerSearchText) !== null);
    };

    useEffect(() => {
        const fetchSafeplaces = (safeplaceIds: string[]) => {
            safeplaceIds.forEach(safeplaceId => {
                Safeplace.get(safeplaceId, userCredentials.token)
                    .then(response => {
                        const gotSafeplace: ISafeplace = {
                            id: response.data._id,
                            name: response.data.name,
                            description: response.data.description,
                            city: response.data.city,
                            address: response.data.address,
                            type: response.data.type,
                            dayTimetable: response.data.dayTimetable,
                            coordinate: response.data.coordinate,
                            ownerId: response.data.ownerId,
                        };

                        setSafeplaces(safeplaces => [ ...safeplaces, gotSafeplace ]);
                    }).catch(err => log.error(err));
            });
        };

        Comment.getAll(userCredentials.token)
            .then(result => {
                const gotComments: IComment[] = result.data.map(comment => ({
                    id: comment._id,
                    userId: comment.userId,
                    safeplaceId: comment.safeplaceId,
                    comment: comment.comment,
                    grade: comment.grade
                }) as IComment);

                setComments(gotComments);

                const safeplaceIds = gotComments.map(comment => comment.safeplaceId);
                const uniqueSafeplaceIds = safeplaceIds.filter((safeplaceId, index) =>
                    safeplaceIds.indexOf(safeplaceId) === index);

                fetchSafeplaces(uniqueSafeplaceIds);

            }).catch(err => log.error(err))
    }, [userCredentials]);

    return (
        <div className="text-center">
            <CommentMonitorFilter searchBarValue={searchText} setDropdownValue={setCommentGrade} setSearchBarValue={setSearchText} />
            <div>
                {(focusComment !== undefined) &&
                    <CommentInfoForm
                        comment={focusComment}
                        setComment={setFocusComment}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveCommentModification(focusComment)} width="100%" />,
                            <Button key="stop-id" text="Annuler" onClick={() => setFocusComment(undefined)} width="100%" />,
                            <Button key="delete-id" text="Supprimer" onClick={() => deleteComment(focusComment)} width="100%" type="warning" />
                        ]}
                    />
                }
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 p-4">
                    {filterComments().map(comment =>
                        <CommentInfoDisplayer
                            key={comment.id}
                            comment={comment}
                            safeplace={getSafeplace(comment.safeplaceId)}
                            onClick={setFocusComment}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentMonitor;