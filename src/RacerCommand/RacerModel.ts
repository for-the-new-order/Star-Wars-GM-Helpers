export interface RacerModel {
    // Racer
    racer: string;
    skill: string;
    type: string;

    // Vehicle
    vehicle: string;
    silhouette: number;
    currentSpeed: number;
    maxSpeed: number;
    handling: number;
    currentSystemStrain: number;
    maxSystemStrain: number;
    currentHull: number;
    maxHull: number;
    part: number;
    lap: number;

    // Symbols
    advantages: number;
    successes: number;
    triumphs: number;
    threats: number;
    failures: number;
    despairs: number;
}
