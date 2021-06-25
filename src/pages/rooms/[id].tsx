import styles from "./styles.module.scss"
import Image from 'next/image';
import logoImg from '../../../public/images/logo.svg'
import {Button} from "../../components/Button";
import {RoomCode} from "../../components/RoomCode";
import {useRouter} from "next/router";
import {FormEvent, useEffect, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {useAuth} from "../../hooks/useAuth";
import {database} from "../../services/firebase";
import {useTheme} from "../../hooks/useTheme";


type Question = {
    id: string,
    author: {
        name: string,
        avatar: string,
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}
type FirebaseQuestions = Record<String, Question>


export default function Room() {
    const {user} = useAuth();
    const {id: roomId} = useRouter().query;
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');
    const {theme} = useTheme();

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);
        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                }
            })

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })

        return () => {
            roomRef.off('value');
        }
    }, [roomId, user?.id]);

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();
        await verifyUserIsAuthenticated()
            .then(verifyNewQuestionIsNotEmpty)
            .then(createQuestionOnFirebase)
            .catch(error => toast.error(error.message, {}))

        async function verifyNewQuestionIsNotEmpty() {
            if (newQuestion.trim() === '') {
                throw Error('Digite sua pergunta.')
            }
        }

        async function verifyUserIsAuthenticated() {
            if (!user) {
                throw Error('É preciso fazer login para perguntar.')
            }
        }

        async function createQuestionOnFirebase() {
            const question = {
                content: newQuestion,
                author: {
                    name: user.name,
                    avatar: user.avatar,
                },
                isHighlighted: false,
                isAnswered: false
            }
            await database.ref(`rooms/${roomId}/questions`).push(question);
            setNewQuestion('');
            toast.success('Sua pergunta foi enviada.')
        }

    }

    return (
        <div className={`${styles.container} ${theme}`}>
            <ToastContainer/>
            <header>
                <div>
                    <Image
                        height={45}
                        src={logoImg}
                    />
                    <RoomCode code={roomId}/>
                </div>
            </header>
            <main>
                <div className={styles.roomTitle}>
                    <h1>{title}</h1>
                    {questions.length > 0 &&
                    <span>{questions.length} {questions.length > 1 ? 'perguntas' : 'pergunta'} </span>}
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className={styles.formFooter}>
                        {
                            user ?
                                <div className={styles.userInfo}>
                                    <Image
                                        className={styles.userImage}
                                        src={user.avatar}
                                        alt={user.name}
                                        width={32}
                                        height={32}
                                    />
                                    <span>{user.name}</span>
                                </div>
                                :
                                <span>Para enviar uma pergunta, <button>faça seu login</button></span>

                        }
                        <Button type='submit' disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    )
}
