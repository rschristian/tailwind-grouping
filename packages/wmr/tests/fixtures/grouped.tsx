import { Logo } from './logo';
import type { ImaginaryType } from './types';

export function App(props: ImaginaryType) {
    return (
        <>
            <Logo />
            <p class="text(blue-500 xl)">Hello Vite + Preact!</p>
            <p className="flex(& col)">
                <a href="https://preactjs.com/" target="_blank" rel="noopener noreferrer">
                    Learn Preact
                </a>
            </p>
        </>
    );
}
