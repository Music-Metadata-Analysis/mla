import ClickInternalLink from "./click.link.internal.component";
import useRouter from "@src/web/navigation/routing/hooks/router.hook";
import type { MouseEventHandler, PropsWithChildren } from "react";

interface ClickLinkProps {
  path: string;
}

export default function ClickInternalLinkContainer({
  children,
  path,
}: PropsWithChildren<ClickLinkProps>) {
  const router = useRouter();

  const clickHandler: MouseEventHandler<HTMLDivElement> = () =>
    router.push(path);

  return (
    <ClickInternalLink clickHandler={clickHandler} path={path}>
      {children}
    </ClickInternalLink>
  );
}
