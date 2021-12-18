import { Logo } from './logo';

export function App(props) {
    return (
        <>
            <Logo />
            <p class="text-blue-500 text-xl">Hello Vite + Preact!</p>
            <p className="flex flex-col">
                <a href="https://preactjs.com/" target="_blank" rel="noopener noreferrer">
                    Learn Preact
                </a>
            </p>
        </>
    );
}
