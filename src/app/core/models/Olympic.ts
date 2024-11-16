// TODO: create here a typescript interface for an olympic country
/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/

import { ParticipationInterface } from "./Participation"

export interface OlympicInterface {
    id: number
    country: string
    participations: ParticipationInterface[]
}
