import { shortString } from "starknet"

export default function Display() {
  return (
    <h1>
      <div>
        Current account:
        <ul className="code">
          0x67b9be2bdf155e96fb195615eb825753b88840bc63bd976436060ebfd8401e0
        </ul>
        Network:
        <ul className="code">
          {shortString.decodeShortString("0x534e5f474f45524c49")}
        </ul>
      </div>
    </h1>
  )
}
