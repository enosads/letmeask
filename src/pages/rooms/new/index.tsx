import Image from 'next/image';
import illustrationImg from '../../../../public/images/illustration.svg';
import logoImg from '../../../../public/images/logo.svg';
import styles from './styles.module.scss'
import Link from 'next/link'
import {Button} from "../../../components/Button";
import {FormEvent, useState} from "react";
import {database} from "../../../services/firebase";
import {useAuth} from "../../../hooks/useAuth";
import Router from "next/router";
import firebase from "firebase";
import {toast, ToastContainer} from "react-toastify";
import {useTheme} from "../../../hooks/useTheme";


export default function NewRoom() {
    const {user} = useAuth();
    const {theme} = useTheme();

    const [roomName, setRoomName] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        verifyRoomNameIsNotEmpty()
            .then(createNewRoomOnFirebase)
            .then(navigateToCreatedRoom)
            .catch(error => toast.error(error.message));

        async function verifyRoomNameIsNotEmpty() {
            if (roomName.trim() === '') {
                throw Error('Nome da sala não informado');
            }
        }

        async function createNewRoomOnFirebase(): Promise<firebase.database.ThenableReference> {
            const roomRef = database.ref('rooms');
            return roomRef.push({
                title: roomName,
                authorId: user?.id
            });
        }

        async function navigateToCreatedRoom(roomRef: firebase.database.ThenableReference) {
            await Router.push(`/rooms/${roomRef.key}`);
        }
    }

    return (
        <div className={`${styles.container} ${theme}`}>
            <ToastContainer autoClose={3000}/>
            <aside>
                <Image
                    src={illustrationImg}
                    alt="Ilustração simbolizando perguntas e respostas"
                />
                <strong>Toda pergunta tem uma resposta</strong>
                <p>Tire as dúvidas de sua audiência em tempo real</p>
            </aside>
            <main>
                <div className={styles.content}>
                    <Image
                        src={logoImg}
                        alt="Letmeask"
                    />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setRoomName(event.target.value)}
                            value={roomName}
                        />
                        <Button type='submit'>
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link href='/'><a>clique aqui</a></Link>
                    </p>
                </div>
            </main>
        </div>
    )
}
