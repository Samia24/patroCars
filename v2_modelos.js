import { lista_de_modelos, lista_de_montadoras } from "./principal.js"
import { obter_texto, obter_numero, obter_boolean, print, clear_screen, enter_to_continue } from "./utils.js"
import {contem_valor} from './funcoes_gerais.js'
import { filtrar_indice } from "./v1_montadoras.js"
import { bubbleSort } from './funcoes_gerais.js';
import {readFileSync, writeFileSync} from 'fs';
import { ulid } from "ulidx";


export function adicionar_modelo(lista_de_modelos, lista_de_montadoras){
    const montadora = filtrar_indice(lista_de_montadoras)
    clear_screen()
    print(`\n>>> DADOS DO MODELO DO VEÍCULO <<<`)
    let dados = {
        id: ulid(),
        modelo: obter_texto('Nome: '),
        montadora_id: montadora.id,
        montadora_nome: montadora.nome,
        valor: obter_numero('Valor referencia: ').toFixed(2),
        motorizacao: obter_numero('Motorizacao (potencia ou cilindradas): ').toFixed(1), 
        turbo: obter_boolean('Turbo (S - sim ou N - nao): '), 
        automatico: obter_boolean('Automatico (S - sim ou N - nao): ')
    }
    lista_de_modelos.push(dados)
}

export function load_modelos(){
    const vetor = []
    const conteudo = readFileSync('modelos.txt', 'utf-8')
    const linhas = conteudo.split('\n')

    for(const linha of linhas){
        const valores = linha.split('|')
        if (valores.length === 8) {
            const id = valores[0]
            const modelo = valores[1]
            const montadora_id = valores[2]
            const montadora_nome = valores[3]
            const valor = valores[4]
            const motorizacao = valores[5]
            const turbo = valores[6]
            const automatico = valores[7]

            vetor.push({ id, modelo, montadora_id, montadora_nome, valor, motorizacao, turbo, automatico })
        }
    }
    return vetor
}

export function salvar_modelos(vetor) {
    let arquivo = ''
    for(let registro of vetor){
        const conteudo = `${registro.id}|${registro.modelo}|${registro.montadora_id}|${registro.montadora_nome}|${registro.valor}|${registro.motorizacao}|${registro.turbo}|${registro.automatico}\n`
        arquivo += conteudo
    }
    writeFileSync('modelos.txt', arquivo, 'utf-8')
}

export function pedir_dados_listagem_modelos(){
    print('\n>> LISTAGEM MODELOS DE VEÍCULOS <<')
    let valor_correto = false
    let propriedade
    let ordem

    while(valor_correto != true){
        propriedade = obter_texto('\nInforme o numero referente a propriedade que deseja listar (modelo, montadora_nome, valor, motorizacao): ').toLowerCase()
        ordem = obter_texto('Informe a ordenacao desejada ASC (Ascendente) ou DESC (Descendente): ').toUpperCase()

        if((propriedade === 'modelo' || propriedade === 'montadora_nome' || propriedade === 'valor' || propriedade === 'motorizacao') && (ordem === 'ASC' || ordem === 'DESC')){
            valor_correto = true
        }else{
            print('\n> Informe valores de propriedade e ordenação válidos!')
        }
    }
    return {propriedade, ordem}
}

export function listar_modelos(vetor, valor, funcao){
    if(vetor.length > 0){
        const dados = pedir_dados_listagem_modelos()
        const vetor_ordenado = bubbleSort(vetor, dados.propriedade, dados.ordem)
        funcao(vetor_ordenado)
    }else{
        print(`\n> Nenhum(a) ${valor} cadastrado(a)!`)
    }
}

export function print_modelos(modelos_ordenados){
    enter_to_continue()
    print(`\n>>> MODELOS DE VEÍCULOS <<<`)
    for(let i = 0; i < modelos_ordenados.length; i++){
        print(`\n *** Modelo ${i+1} ***`)
        print(`   ID: ${modelos_ordenados[i].id}`)
        print(`   Modelo: ${modelos_ordenados[i].modelo}`)
        print(`   ID Montadora: ${modelos_ordenados[i].montadora_id}`)
        print(`   Nome Montadora: ${modelos_ordenados[i].montadora_nome}`)
        print(`   Valor de Ref.: R$ ${Number(modelos_ordenados[i].valor).toFixed(2)}`)
        print(`   Motorizacao (cilindradas): ${Number(modelos_ordenados[i].motorizacao).toFixed(1)}`)
        print(`   Turbo: ${modelos_ordenados[i].turbo ? 'Sim':'Nao'}`)
        print(`   Automático: ${modelos_ordenados[i].automatico ? 'Sim':'Nao'}`)
        print('---------------------------')
    }

    print(`\n>>> Status: Temos ${modelos_ordenados.length} modelo(s) cadastrado(s)! <<<`)
}

export function filtrar_modelo(nome_modelo){
    let modelos_filtrados = []
    for(let registro of lista_de_modelos){
        if(contem_valor(nome_modelo, registro.modelo)){
            modelos_filtrados.push(registro)
        }
    }
    return modelos_filtrados
}

export function filtrar_montadora(nome_montadora){
    let montadoras_filtradas = []
    for(let registro of lista_de_modelos){
        if(contem_valor(nome_montadora, registro.montadora_nome)){
            montadoras_filtradas.push(registro)
        }
    }
    return montadoras_filtradas
}

export function filtrar_valor(valor_modelo){
    let modelos_filtrados = []
    for(let registro of lista_de_modelos){
        if(contem_valor(valor_modelo, registro.valor)){
            modelos_filtrados.push(registro)
        }
    }
    return modelos_filtrados
}

export function filtrar_motorizacao(motor){
    let modelos_filtrados = []
    for(let registro of lista_de_modelos){
        if(contem_valor(motor, registro.motorizacao)){
            modelos_filtrados.push(registro)
        }
    }
    return modelos_filtrados
}

export function filtrar_modelos_veiculos(modelos){
    if(modelos.length > 0){

        let dados = pedir_dados_listagem_modelos()
        let valor = obter_texto('Informe o valor que deseja buscar: ')
        let lista_modelos_filtrados = []
        let resultado = false
        
        while(resultado != true){
            
            if(dados.propriedade === 'modelo'){
                lista_modelos_filtrados = filtrar_modelo(valor)
                resultado = true
                
            }else if(dados.propriedade === 'montadora_nome'){
                lista_modelos_filtrados = filtrar_montadora(valor)
                resultado = true
                
            }else if(dados.propriedade === 'valor'){
                lista_modelos_filtrados = filtrar_valor(valor)
                resultado = true

            }else if(dados.propriedade === 'motorizacao'){
                lista_modelos_filtrados = filtrar_motorizacao(valor)
                resultado = true
            }else{
                print('\n>> Propriedade inválida !!!')
                dados = pedir_dados_listagem()
                valor = obter_texto('Informe o valor que deseja buscar: ')
            }
        }   
    
        const modelos_ordenados = bubbleSort(lista_modelos_filtrados, dados.propriedade, dados.ordem)
        print_modelos(modelos_ordenados)
    }else{
        print('\n> Nenhum Modelo cadastrado!')
    }

}

export function remover_modelo(modelos){
    listar_modelos(modelos, 'Modelo', print_modelos)
    let indice_usuario = obter_numero('\nInforme o numero do modelo que deseja remover: ')
    let indice = indice_usuario - 1
    let encontrado = false

    while(encontrado != true){
        if(indice >= 0 && indice < modelos.length){
            modelos.splice(indice, 1)
            encontrado = true
        }else{
            print('\nÍndice não encontrado ou inválido!')
            indice_usuario = obter_numero('\nInforme o numero do modelo que deseja remover: ')
            indice = indice_usuario - 1
        }
    }
    clear_screen()
    print(`\n> Modelo ${indice_usuario} removido com sucesso!`)
    return modelos
}

export function atualizar_modelos(modelos){
    listar_modelos(modelos, 'Modelos', print_modelos)
    let indice_usuario = obter_numero('\nInforme o numero do Modelo que deseja alterar: ')
    let indice = indice_usuario - 1
    let encontrado = false
    clear_screen()
    print(`\n>> Atualização do Modelo ${indice_usuario} <<\n`)

    while(encontrado != true){
        if(indice >= 0 && indice < modelos.length){
            let dado_correto = false
            let propriedade
            
            while(dado_correto != true){
                propriedade = obter_texto('\nInforme o nome da propriedade que deseja alterar (modelo, valor, montadora_nome, motorizacao, turbo, automatico): ').toLowerCase()
                if(propriedade === 'modelo'){
                    modelos[indice].modelo = obter_texto(`Informe o novo nome do Modelo: `)
                    dado_correto = true
                }else if(propriedade === 'valor'){
                    modelos[indice].valor = obter_texto(`Informe o novo valor: `)
                    dado_correto = true
                }else if(propriedade === 'montadora_nome'){
                    clear_screen()
                    const montadora = filtrar_indice(lista_de_montadoras)
                    modelos[indice].montadora_nome = montadora.nome
                    dado_correto = true
                }else if(propriedade === 'motorizacao'){
                    modelos[indice].motorizacao = obter_numero(`Informe a nova motorizacao: `)
                    dado_correto = true
                }else if(propriedade === 'turbo'){
                    modelos[indice].turbo = obter_boolean('Turbo (S - sim ou N - nao): ')
                    dado_correto = true
                }else if(propriedade === 'automatico'){
                    modelos[indice].automatico = obter_boolean('Automatico (S - sim ou N - nao): ')
                    dado_correto = true
                }
                print('\n> Informe uma propriedade válida!')
            }

            encontrado = true

        }else{
            print('\nÍndice não encontrado ou inválido!')
            indice_usuario = obter_numero('\nInforme o numero do Modelo que deseja alterar: ')
            indice = indice_usuario - 1
        }
    }
    clear_screen()
    print(`\n> Modelo ${indice_usuario} alterado com sucesso!`)
    return modelos
}

export function filtrar_indice_modelos(modelos){
    listar_modelos(modelos, 'Modelo', print_modelos)
    let encontrado = false
    
    while(encontrado != true){
        let indice_usuario = obter_numero('Informe o numero do Modelo: ')
        let indice = indice_usuario - 1

        if(indice >= 0 && indice < modelos.length){
            encontrado = true
            return modelos[indice]
        }else{
            print('\nIndice nao encontrado ou invalido!')
        }
    }
    clear_screen()
}