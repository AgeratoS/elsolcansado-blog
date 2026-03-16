import Link from "next/link";

export function NoPostExists() {
    return (
        <div>
            <h1>Нет такого поста</h1>
            <p>Попробуйте найти другой пост</p>
            <Link href="/">На главную</Link>
        </div>
    );
}