/* Letter-by-letter rolling label for text links. The parent link carries
   the `roll-host` class; screen readers get the plain text once. */

export default function Roll({ text, className = "" }: { text: string; className?: string }) {
    return (
        <span className={`roll ${className}`}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true" className="roll-word">
                {Array.from(text).map((char, i) => (
                    <span key={i} className="roll-clip">
                        <span className="roll-letter" data-l={char} style={{ "--i": Math.min(i, 24) } as React.CSSProperties}>
                            {char}
                        </span>
                    </span>
                ))}
            </span>
        </span>
    );
}
