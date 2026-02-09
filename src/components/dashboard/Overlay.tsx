type Props = {
  onClick: () => void
}

export default function Overlay({ onClick }: Props) {
  return <div className="overlay" onClick={onClick} />
}
