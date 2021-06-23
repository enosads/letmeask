import Image from 'next/image';
import illustrationImg from '../../public/images/illustration.svg';
import googleIconImg from '../../public/images/google-icon.svg';
import logoImg from '../../public/images/logo.svg';
import styles from './styles.module.scss'
import {Button} from "../components/Button";
import Router from "next/router";
import {useAuth} from "../hooks/useAuth";

export default function Home() {
    const {user, signInWithGoogle} = useAuth();

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

    return (
        <div className={styles.container}>
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
                    <form>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
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
