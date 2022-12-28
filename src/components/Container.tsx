export function Container({
  children,
  classNames = "",
}: {
  children: React.ReactNode;
  classNames?: string;
}) {
  return <div className={`m-auto max-w-4xl ${classNames}`}>{children}</div>;
}
