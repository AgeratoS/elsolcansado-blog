import { InputGroup, InputGroupAddon, InputGroupInput } from "@frontend/shared/ui";
import { mainMenu } from "@frontend/shared/config/menu";
import { Logo } from "@frontend/shared/ui/logo";
import * as m from "motion/react-client";
import Link from "next/link";
import { Search } from 'lucide-react';
import { useId } from "react";

export function Header() {

    const searchId = useId();

    return (
        <m.header className="p-2 md:p-4">
            {/* Header container */}
            <m.div className="container mx-auto flex justify-between items-center">
                {/* Logo block */}
                <m.div>
                    <Logo />
                </m.div>

                {/* Navigation */}
                <nav>
                    <ul className="flex items-center hidden md:flex gap-16">
                        {mainMenu.map((item) => (
                            <li key={item.id}>
                                <Link href={item.href} className="text-sm font-medium hover:text-primary transition-colors">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Search */}
                <m.div>
                    <InputGroup>
                        <InputGroupInput id={searchId} placeholder="Поиск..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </m.div>
            </m.div>
        </m.header>
    )
}