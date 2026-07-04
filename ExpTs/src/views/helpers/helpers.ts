export interface Prof {
    nome: string;
    sala: number
}

function listProfs(profs: Prof[]) {
    const list = profs.map(p => `<li>${p.nome} - ${p.sala}</li>`).join('')
    return `<ul>${list}</ul>`
}

export default {
    listProfs,
    eq: (a: unknown, b: unknown) => a === b,
    lte: (a: number, b: number) => a <= b,
}
