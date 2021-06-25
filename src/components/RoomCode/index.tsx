import styles from './styles.module.scss'
import Image from "next/image";
import copyImg from "../../../public/images/copy.svg";

type RoomCodeProps = {
    code: string;
}

export function RoomCode({code}: RoomCodeProps) {
    async function copyRoomCodeToclipboard() {
        await navigator.clipboard.writeText(code);
    }

    return (
        <button className={styles.roomCode} onClick={copyRoomCodeToclipboard}>
            <div>
                <Image
                    src={copyImg}
                    alt='Copy room code'
                />
            </div>
            <span>
              Sala #{code}
          </span>
        </button>
    );
}