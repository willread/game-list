/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RelayTest_CollectionItem = {
    readonly id: string;
    readonly purchasePrice: number | null;
    readonly " $refType": "RelayTest_CollectionItem";
};
export type RelayTest_CollectionItem$data = RelayTest_CollectionItem;
export type RelayTest_CollectionItem$key = {
    readonly " $data"?: RelayTest_CollectionItem$data;
    readonly " $fragmentRefs": FragmentRefs<"RelayTest_CollectionItem">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RelayTest_CollectionItem",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "purchasePrice",
      "storageKey": null
    }
  ],
  "type": "CollectionItem",
  "abstractKey": null
};
(node as any).hash = '9f63772dee3cbcad3d71dfdf2a5a0f46';
export default node;
