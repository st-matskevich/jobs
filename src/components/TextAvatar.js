import "./TextAvatar.scss"

const colorsPalette = [
    '#bdc3c7', '#6f7b87', '#2c3e50',
    '#2f3193', '#662d91', '#922790',
    '#ec2176', '#ed1c24', '#f36622',
    '#f8941e', '#fab70f', '#fdde00',
    '#d1d219', '#8ec73f', '#00a650',
    '#00aa9c', '#00adef', '#0081cd',
    '#005bab'];

function TextAvatar(props) {
    const text = props.text.split(/[\s.\-_]/).reduce((res, part) => (res ? res[0] : '') + (part ? part[0] : ''), "").toUpperCase();
    const color = colorsPalette[props.text.split("").reduce((res, part) => res + part.charCodeAt(0), 0) % colorsPalette.length];
    return (
        <svg width={props.width} height={props.height} className="text-avatar">
            <rect x="0" y="0" width="100%" height="100%" fill={color}></rect>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="#ffffff">{text}</text>
        </svg>)
}

export default TextAvatar;