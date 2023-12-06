import {question} from 'readline-sync';

export function obter_numero(descricao){
    return Number(question(descricao))
}

export function obter_numero_minimo(descricao, minimo){
    let numero = obter_numero(descricao)

    while (numero < minimo || numero > 9999){
        console.log(`ERROR: Digite um número >= ${minimo} ou <= 9999 !`)
        numero = obter_numero(descricao)
    }
    return numero
}

export function obter_numero_maximo(descricao, maximo){
    let numero = obter_numero(descricao)

    while (numero < 1000 || numero > maximo){
        console.log(`ERROR: Digite um número >= 1000 ou <= ${maximo} !\n`)
        numero = obter_numero(descricao)
    }
    return numero
}

export function obter_texto(descricao){
    return question(descricao)
}

export function print(descricao){
    console.log(descricao)
}

export function print_inline(descricao){
    process.stdout.write(`${descricao}`)
}

export function clear_screen(){
    console.clear()
}

export function enter_to_continue(){
    obter_texto('\n<enter>... to continue')
    clear_screen()
}

export function obter_boolean(descricao){
    let valor_booleano = (question(descricao)).toUpperCase()
    let resposta = false
    
    while(resposta != true){
        if(valor_booleano === 'S'){
            resposta = true
            return true
        }else if(valor_booleano === 'N'){
            resposta = true
            return false
        }else{
            print('\n> Informe uma resposta válida!')
            valor_booleano = (question(descricao)).toUpperCase()
        }

    }
}

export function deseja_salvar(funcao, vetor){
    let salvar = obter_texto('Deseja salvar os dados antes de sair? (S - sim ou N - nao): ').toUpperCase()
    let validacao = false
    while(validacao != true){
        if(salvar === 'S'){
            funcao(vetor)
            print('\n> Dados salvos com sucesso!')
            validacao = true
        }else if(salvar === 'N'){
            print('\n> Dados nao armazenados no arquivo!')
            validacao = true
        }else{
            salvar = obter_texto('Opção inválida ! Informe novamente. \nDeseja salvar os dados antes de sair? (S - sim ou N - nao): ').toUpperCase()
        }

    }
}
