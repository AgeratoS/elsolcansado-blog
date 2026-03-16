"use client";
//@ts-expect-error У PrismJS нет TS-типов
import Prism from "prismjs";
import { useEffect } from "react";
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';
import Script from "next/script";

/**
 * PostContent component is used to display the content of a post.
 * It uses Prism.js to highlight the code blocks.
 * @param props - The props for the PostContent component.
 * @param props.contentHtml - The HTML content of the post.
 * @returns The PostContent component.
 */

export function PostContent(props: { contentHtml: string }) {
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <>
        <section className="post" dangerouslySetInnerHTML={{ __html: props.contentHtml }} />
        </>
    )
}