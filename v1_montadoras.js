import {obter_numero, obter_texto, print, clear_screen, deseja_salvar, enter_to_continue} from './utils.js'
import {contem_valor} from './funcoes_gerais.js'
import { lista_de_modelos, lista_de_montadoras } from './principal.js'
import { ulid } from "ulidx";
import {readFileSync, writeFileSync} from 'fs';
import { bubbleSort } from './funcoes_gerais.js';
import { load_modelos, print_modelos, salvar_modelos } from './v2_modelos.js';
import { load_veiculos, print_veiculos, salvar_veiculos } from './v3_veiculos.js';


export function adicionar_nova_montadora(){
    print(`>>> DADOS DA MONTADORA <<<`)
    let dados = {
        id: ulid(),
        nome: obter_texto('Nome: '),
        pais: obter_texto('País: '),
        ano: obter_numero('Ano de fundação: ')
    }
    lista_de_montadoras.push(dados)
}


function pedir_dados_listagem(){
    print('\n>> LISTAGEM DE MONTADORAS <<')
    let valor_correto = false
    let propriedade
    let ordem

    while(valor_correto != true){
        propriedade = obter_texto('\nInforme o nome da propriedade que deseja listar (nome, pais, ano): ').toLowerCase()
        ordem = obter_texto('Informe a ordenacao desejada ASC (Ascendente) ou DESC (Descendente): ').toUpperCase()

        if((propriedade === 'nome' || propriedade === 'pais' || propriedade === 'ano') && (ordem === 'ASC' || ordem === 'DESC')){
            valor_correto = true
        }else{
            print('\n> Informe valores de propriedade e ordenação válidos!')
        }
    }
    return {propriedade, ordem}
    
}

export function print_montadoras(montadoras_ordenadas){
    print(`\n>>> MONTADORAS <<<`)
    for(let i = 0; i < montadoras_ordenadas.length; i++){
        print(`\n *** Montadora ${i+1} ***`);
        print(`   ID: ${montadoras_ordenadas[i].id}`)
        print(`   Nome: ${montadoras_ordenadas[i].nome}`)
        print(`   País: ${montadoras_ordenadas[i].pais}`)
        print(`   Ano de Fundação: ${montadoras_ordenadas[i].ano}`)
        print('---------------------------')
    }

    print(`\n>>> Status: Temos ${montadoras_ordenadas.length} montadoras cadastradas! <<<`)
}

export function listar_vetor(vetor, valor, funcao){
    if(vetor.length > 0){
        const dados = pedir_dados_listagem()
        const vetor_ordenado = bubbleSort(vetor, dados.propriedade, dados.ordem)
        funcao(vetor_ordenado)
        return vetor_ordenado
    }else{
        print(`\n> Nenhum(a) ${valor} cadastrado(a)!`)
    }
}


export function atualizar_montadoras(montadoras){
    listar_vetor(montadoras, 'Montadora', print_montadoras)
    let indice_usuario = obter_numero('\nInforme o numero da montadora que deseja alterar: ')
    let indice = indice_usuario - 1
    let encontrado = false

    while(encontrado != true){
        if(indice >= 0 && indice < montadoras.length){
            let propriedade = obter_texto('Informe o nome da propriedade que deseja alterar (nome, pais, ano): ').toLowerCase()
            if(propriedade === 'nome'){
                montadoras[indice].nome = obter_texto(`Informe o novo nome da Montadora ${indice_usuario}: `)
            }else if(propriedade === 'pais'){
                montadoras[indice].pais = obter_texto(`Informe o novo pais da Montadora ${indice_usuario}: `)
            }else if(propriedade === 'ano'){
                montadoras[indice].ano = obter_numero(`Informe o novo ano de fundacao da Montadora ${indice_usuario}: `)
            }
            encontrado = true
        }else{
            print('\nÍndice não encontrado ou inválido!')
            indice_usuario = obter_numero('\nInforme o numero da montadora que deseja remover: ')
            indice = indice_usuario - 1
        }
    }
    clear_screen()
    print(`\n> Montadora ${indice_usuario} alterada com sucesso!`)
    return montadoras
}

export function filtrar_indice(montadoras){
    listar_vetor(montadoras, 'Montadora', print_montadoras)
    let encontrado = false
    
    while(encontrado != true){
        let indice_usuario = obter_numero('Informe o numero da Montadora: ')
        let indice = indice_usuario - 1

        if(indice >= 0 && indice < montadoras.length){
            encontrado = true
            return montadoras[indice]
        }else{
            print('\nIndice nao encontrado ou invalido!')
        }
    }
    clear_screen()
}

export function filtrar_nome(nome_montadora){
    let montadoras_filtradas = []
    for(let montadora of lista_de_montadoras){
        if(contem_valor(nome_montadora, montadora.nome)){
            montadoras_filtradas.push(montadora)
        }
    }
    return montadoras_filtradas
}

export function filtrar_pais(pais_montadora){
    let montadoras_filtradas = []
    for(let montadora of lista_de_montadoras){
        if(contem_valor(pais_montadora, montadora.pais)){
            montadoras_filtradas.push(montadora)
        }
    }
    return montadoras_filtradas
}

export function filtrar_ano(ano_montadora){
    let montadoras_filtradas = []
    for(let montadora of lista_de_montadoras){
        if(contem_valor(ano_montadora, montadora.ano)){
            montadoras_filtradas.push(montadora)
        }
    }
    return montadoras_filtradas
}

export function filtrar_montadoras(montadoras){
    if(montadoras.length > 0){

        let dados = pedir_dados_listagem()
        let valor = obter_texto('Informe o valor que deseja buscar: ')
        let lista_montadoras_filtradas = []
        let resultado = false
        
        while(resultado != true){
            
            if(dados.propriedade === 'nome'){
                lista_montadoras_filtradas = filtrar_nome(valor)
                resultado = true
                
            }else if(dados.propriedade === 'pais'){
                lista_montadoras_filtradas = filtrar_pais(valor)
                resultado = true
                
            }else if(dados.propriedade === 'ano'){
                lista_montadoras_filtradas = filtrar_ano(valor)
                resultado = true

            }else{
                print('\n>> Propriedade inválida !!!')
                dados = pedir_dados_listagem()
                valor = obter_texto('Informe o valor que deseja buscar: ')
            }
        }   
    
        const montadoras_ordenadas = bubbleSort(lista_montadoras_filtradas, dados.propriedade, dados.ordem)
        print_montadoras(montadoras_ordenadas)
    }else{
        print('Nenhuma Montadora cadastrada!')
    }

}

export function remover(){
    let montadoras = []
    montadoras = load_montadoras()
    let modelos = []
    modelos = load_modelos()
    let veiculos = []
    veiculos = load_veiculos()

    if(montadoras.length > 0){
        print_montadoras(montadoras)
    
        let indice_usuario = obter_numero('\nInforme o numero da montadora que deseja remover: ')
        let indice = indice_usuario - 1
        let indice_correto = false
    
        let confirmar_remocao
    
        while(indice_correto != true){
            if(indice >= 0 && indice < montadoras.length){
        
                let modelos_associados = []
                for(let i = 0; i < modelos.length; i++){
                    if(modelos[i].montadora_id === montadoras[indice].id){
                        modelos_associados.push(modelos[i])
                    }
                }
                
                let veiculos_associados = []
                for(let i = 0; i < veiculos.length; i++){
                    if(veiculos[i].montadora_id === montadoras[indice].id){
                        veiculos_associados.push(veiculos[i])
                    }
                }
                
        
                if(modelos_associados.length > 0){
                    print(`\n> A Montadora ${montadoras[indice].nome} possui Modelos associados a ela!`)
                    print_modelos(modelos_associados)

                    if(veiculos_associados.length > 0){
                        print(`\n> A Montadora ${montadoras[indice].nome} possui Veiculos associados a ela!`)
                        print_veiculos(veiculos_associados)
                    }
        
                    confirmar_remocao = obter_texto(`\n> Deseja remover mesmo assim? (S - sim ou N - nao): `).toUpperCase()
        
                    if(confirmar_remocao === 'S'){
                        montadoras.splice(indice, 1)
                        for(let i = 0; i < modelos.length; i++){
                            for(let j = 0; j < modelos_associados.length; j++){
                                if(modelos[i].id === modelos_associados[j].id){
                                    modelos.splice(i, 1)
                                }
                            }
                        }
                        if(veiculos_associados.length > 0){
                            for(let i = 0; i < veiculos.length; i++){
                                for(let j = 0; j < veiculos_associados.length; j++){
                                    if(veiculos[i].id === veiculos_associados[j].id){
                                        veiculos.splice(i, 1)
                                    }
                                }
                            }
                            //Se tiver veículos associados
                            print(`\n> Montadora ${indice_usuario}, ${modelos_associados.length} modelo(s) e ${veiculos_associados.length} veiculo(s) associado(s) removidos com sucesso!`)

                        }else{
                            //Se não tiver veículos associados
                            print(`\n> Montadora ${indice_usuario} e ${modelos_associados.length} modelo(s) associado(s) removidos com sucesso!`)
                        }
                        
                    }else if(confirmar_remocao === 'N'){
                        print(`\n> Montadora ${indice_usuario} nao removida!`)
                        
                    }else{
                        print(`\n> Resposta Inválida!`)
                    }
                }else{
                    print(`\n> Nao existem modelos associados a essa Montadora!`)
                    montadoras.splice(indice, 1)
                    print(`\n> Montadora ${indice_usuario} removida com sucesso!`)
                }
                indice_correto = true
            }else{
                print('\nÍndice não encontrado ou inválido!')
                indice_usuario = obter_numero('\nInforme o numero da montadora que deseja remover: ')
                indice = indice_usuario - 1
            }
        }
        print('\n>> Referente a Montadoras:')
        deseja_salvar(salvar_montadoras, montadoras)
        enter_to_continue()
        print('\n>> Referente a Modelos de Veículos:')
        deseja_salvar(salvar_modelos, modelos)
        enter_to_continue()
        print('\n>> Referente a Veículos:')
        deseja_salvar(salvar_veiculos, veiculos)
        
    }else{
        print('\n> Nao ha montadoras cadastradas!')
    }
    
    return {montadoras, modelos, veiculos}
}


export function load_montadoras(){
    const vetor = []
    const conteudo = readFileSync('montadoras.txt', 'utf-8')
    const linhas = conteudo.split('\n')

    for(const linha of linhas){
        const valores = linha.split('|')
        if (valores.length === 4) {
            const id = valores[0]
            const nome = valores[1]
            const pais = valores[2]
            const ano = valores[3]

            vetor.push({ id, nome, pais, ano })
        }
    }
    return vetor
}

export function salvar_montadoras(vetor) {
    let arquivo = ''
    for(let registro of vetor){
        const conteudo = `${registro.id}|${registro.nome}|${registro.pais}|${registro.ano}\n`
        arquivo += conteudo
    }
    writeFileSync('montadoras.txt', arquivo, 'utf-8')
}
