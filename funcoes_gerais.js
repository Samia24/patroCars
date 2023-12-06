
export function contem_valor(parte_palavra, palavra){
    const string_quebrada = palavra.split(parte_palavra)
    if(string_quebrada.length > 1){
        return true
    }else{
        return false
    }
}

export function comparar_itens_propriedade(item_posicao_anterior, item_proxima_posicao, propriedade) {
    let valor1 = item_posicao_anterior[propriedade]
    let valor2 = item_proxima_posicao[propriedade]

    if (propriedade === 'ano' || propriedade === 'valor' || propriedade === 'motorizacao'){
        valor1 = Number(valor1)
        valor2 = Number(valor2)    
    }
    
    if (valor1 < valor2){
        return -1
    }else if (valor1 > valor2){
        return 1
    }else{
        return 0
    }

}

export function trocar_elementos_posicao(vetor, indice_atual, proximo_indice) {
    const variavel_temporaria = vetor[indice_atual]
    vetor[indice_atual] = vetor[proximo_indice]
    vetor[proximo_indice] = variavel_temporaria
}

export function bubbleSort(vetor, propriedade, ordem) {
    const qtd_itens_vetor = vetor.length

    for (let i = 0; i < qtd_itens_vetor - 1; i++) {
        for (let j = 0; j < qtd_itens_vetor - 1 - i; j++){
            const comparacao = comparar_itens_propriedade(vetor[j], vetor[j + 1], propriedade)
            if ((ordem === 'ASC' && comparacao > 0) || (ordem === 'DESC' && comparacao < 0)){
                trocar_elementos_posicao(vetor, j, j + 1)
            }
        }
    }
    return vetor
}