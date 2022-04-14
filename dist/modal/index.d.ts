import type { IStarknetWindowObject, ModalOptions } from "../types";
import "svelte";
export default function show(installed: IStarknetWindowObject[], options?: ModalOptions): Promise<IStarknetWindowObject | undefined>;
