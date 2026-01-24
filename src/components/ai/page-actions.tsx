/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
'use client';

import { Bot, Check, ChevronDown, Copy, ExternalLink, FileText, MessageSquare, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

interface PageActionsProps {
    markdownUrl: string;
    fullUrl?: string;
}

export function PageActions({ markdownUrl, fullUrl = '/llms-full.txt' }: PageActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Absolute URL for LLM Hints (Claude/ChatGPT need a full domain)
    const domain = "https://docs.iqra.bot";
    const absoluteMdUrl = `${domain}${markdownUrl}`;

    const hint = (service: string) =>
        `Read ${absoluteMdUrl} so I can ask questions about it.`;

    const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(hint('Claude'))}`;
    const chatGptUrl = `https://chatgpt.com/?hint=search&q=${encodeURIComponent(hint('ChatGPT'))}`;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onCopy = async () => {
        try {
            const res = await fetch(markdownUrl);
            const text = await res.text();
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const ActionButton = ({ onClick, href, children, icon: Icon, disabled }: any) => {
        const className = cn(
            "flex items-center gap-1.5 text-sm font-medium transition-colors",
            disabled
                ? "text-fd-muted-foreground/50 cursor-not-allowed"
                : "text-fd-muted-foreground hover:text-fd-foreground"
        );

        if (href && !disabled) return <a href={href} target="_blank" rel="noreferrer" className={className}>{Icon && <Icon className="size-4" />}{children}</a>;
        return <button onClick={disabled ? undefined : onClick} className={className}>{Icon && <Icon className="size-4" />}{children}</button>;
    };

    const Separator = () => <div className="h-4 w-0.5 bg-fd-border mx-1" />;

    return (
        <div className="flex flex-col w-full border-b border-fd-border pb-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">

                {/* 1. Ask AI (Disabled for now) */}
                <div className="group relative">
                    <ActionButton icon={Sparkles} disabled>Ask a question</ActionButton>
                    <span className="absolute -top-8 left-0 scale-0 transition-all rounded bg-fd-secondary px-2 py-1 text-[10px] group-hover:scale-100">Coming Soon</span>
                </div>

                <Separator />

                {/* 2. Copy Page */}
                <ActionButton onClick={onCopy} icon={copied ? Check : Copy}>
                    {copied ? "Copied!" : "Copy page"}
                </ActionButton>

                <Separator />

                {/* 3. View as Markdown */}
                <ActionButton href={markdownUrl} icon={FileText}>View as Markdown</ActionButton>

                <Separator />

                {/* 4. More Actions Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-1 text-sm font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                    >
                        More actions <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
                    </button>

                    {isOpen && (
                        <div className="absolute left-0 z-50 mt-2 w-56 origin-top-left rounded-md border bg-fd-popover p-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-fd-muted-foreground/70">
                                Open in LLMs
                            </div>

                            <a href={claudeUrl} target="_blank" rel="noreferrer" className="flex items-center rounded-sm px-2 py-1.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground">
                                <MessageSquare className="mr-2 size-4" /> Open in Claude
                            </a>

                            <a href={chatGptUrl} target="_blank" rel="noreferrer" className="flex items-center rounded-sm px-2 py-1.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground">
                                <Bot className="mr-2 size-4" /> Open in ChatGPT
                            </a>

                            <div className="h-0.5 bg-fd-border my-1" />

                            <a href={fullUrl} target="_blank" rel="noreferrer" className="flex items-center rounded-sm px-2 py-1.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground">
                                <ExternalLink className="mr-2 size-4" /> LLMs Full (llms-full.txt)
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}