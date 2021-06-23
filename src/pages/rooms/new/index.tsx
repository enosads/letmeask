import Image from 'next/image';
import illustrationImg from '../../../../public/images/illustration.svg';
import logoImg from '../../../../public/images/logo.svg';
import styles from './styles.module.scss'
import Link from 'next/link'
import {Button} from "../../../components/Button";
import {useEffect} from "react";
import {firebase} from "../../../services/firebase";
import {useAuth} from "../../../hooks/useAuth";

export default function NewRoom() {
    const {saveUserState} = useAuth();
    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            saveUserState(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className={styles.container}>
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
                    <form>
                        <input
                            type="text"
                            placeholder="Nome da sala"
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
