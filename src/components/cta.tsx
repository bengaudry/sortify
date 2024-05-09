const style = "flex gap-3 bg-spotify-500 hover:bg-spotify-400 active:bg-spotify-600 rounded-full px-6 py-2 font-semibold text-spotify-900 hover:cursor-pointer transition-colors w-fit disabled:opacity-50" + " ";

export function CtaButton(props: JSX.IntrinsicElements["button"]) {
  const { className, ...otherProps } = props;
  return <button className={style + className} {...otherProps} />;
}

export function CtaLink(props: JSX.IntrinsicElements["a"]) {
  const { className, children, ...otherProps } = props;
  return <a className={style + className} {...otherProps}>{children}</a>;
}
