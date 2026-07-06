"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/frontend/shared/ui";
import { Search } from "lucide-react";
import { useId, type FormEvent } from "react";

type HeaderSearchViewProps = {
  onSearch?: (query: string) => void;
};

export function HeaderSearchView({ onSearch }: HeaderSearchViewProps) {
  const searchId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("search") ?? "").trim();

    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} role="search">
      <InputGroup className="h-10 w-44 rounded-xl border-0 bg-muted shadow-none md:w-52">
        <InputGroupAddon>
          <Search className="size-4 text-muted-foreground" aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          id={searchId}
          name="search"
          type="search"
          placeholder="Поиск..."
          className="text-sm placeholder:text-muted-foreground"
          aria-label="Поиск по статьям"
        />
      </InputGroup>
    </form>
  );
}
