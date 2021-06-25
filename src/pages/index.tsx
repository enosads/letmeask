import Image from 'next/image';
import illustrationImg from '../../public/images/illustration.svg';
import googleIconImg from '../../public/images/google-icon.svg';
import logoImg from '../../public/images/logo.svg';
import styles from './styles.module.scss'
import {Button} from "../components/Button";
import Router from "next/router";
import {useAuth} from "../hooks/useAuth";
import {FormEvent, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {database, firebase} from "../services/firebase";


export default function Home() {
    const {user, signInWithGoogle} = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        checkAuthentication()
            .then(() => navigateToNewRoomPage());

        async function checkAuthentication() {
            console.log(user);
            if (!user) {
                await signInWithGoogle();
            }
        }

        function navigateToNewRoomPage() {
            return Router.push('/rooms/new');
        }
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        verifyRoomCodeIsNotEmpty()
            .then(findRoomOnFirebase)
            .then(navigateToRoom)
            .catch(error => toast.error(error.message));

        async function verifyRoomCodeIsNotEmpty() {
            if (roomCode.trim() === '') {
                throw Error('Código da sala não digitado');
            }
        }

        async function findRoomOnFirebase(): Promise<firebase.database.DataSnapshot> {
            const roomRef = await database.ref(`rooms/${roomCode}`).get();
            if (!roomRef.exists()) {
                throw Error('Sala não encontrada');
            }
            return roomRef;
        }

        async function navigateToRoom(roomRef: firebase.database.DataSnapshot) {
            await Router.push(`/rooms/${roomRef.key}`);
        }
    }

    return (
        <div className={styles.container}>
            <ToastContainer autoClose={3000}/>
            <aside>
                <Image
                    src={illustrationImg}
                    alt="Landscape picture"
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
                    <button
                        onClick={handleCreateRoom}
                        className={styles.createRoom}

                    >
                        <Image
                            src={googleIconImg}
                            alt="Logo do Google"
                        />
                        Crie sua sala com o Google
                    </button>
                    <div className={styles.separator}>
                        ou entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type='submit'>
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
