import { mainMenu } from "@/frontend/shared/config/menu";
import { Logo } from "@/frontend/shared/ui/logo";
import * as m from "motion/react-client";
import Link from "next/link";

export function Footer() {
    return (
        <m.footer>
            {/* Container */}
            <m.div className="container mx-auto">
                <m.div className="flex gap-16 flex-col md:flex-row py-4 px-2">
                    <div className="flex flex-col">
                        <Logo />
                        <span className="text-sm text-gray-500">Независимое издание о технологиях, науке и будущем.</span>
                    </div>
                    <nav className="flex gap-16">
                        <div>
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-200/40">Навигация</span>
                        <ul>
                            {mainMenu.map((item) => (
                                <li key={item.id}>
                                    <Link href={item.href} className="text-sm text-gray-200 hover:text-gray-500 transition-colors">{item.label}</Link>
                                </li>
                            ))}
                        </ul>

                        </div>
                        <div>
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-200/40">Категории</span>
                            <ul>
                                
                            </ul>
                        </div>
                    </nav>
                </m.div>
            </m.div>
            <hr />
            <m.div className="container mx-auto">
                <m.div className="flex justify-center items-center p-4">
                    <span className="text-sm text-gray-500">© 2026 - Все права защищены</span>
                </m.div>
            </m.div>
        </m.footer>
    )
}