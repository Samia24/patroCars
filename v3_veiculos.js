import { ulid } from "ulidx"
import { clear_screen, deseja_salvar, enter_to_continue, obter_boolean, obter_numero, obter_numero_maximo, obter_numero_minimo, obter_texto, print } from "./utils.js"
import { filtrar_indice, listar_vetor, load_montadoras, print_montadoras } from "./v1_montadoras.js"
import {readFileSync, writeFileSync} from 'fs';
import { lista_de_veiculos, lista_de_montadoras } from "./principal.js";
import { listar_modelos, load_modelos, print_modelos } from "./v2_modelos.js";
import { bubbleSort, contem_valor } from "./funcoes_gerais.js";


export function load_veiculos(){
    const vetor = []
    const conteudo = readFileSync('veiculos.txt', 'utf-8')
    const linhas = conteudo.split('\n')

    for(const linha of linhas){
        const valores = linha.split('|')
        if (valores.length === 11) {
            const id = valores[0]
            const modelo_id = valores[1]
            const modelo_nome = valores[2]
            const montadora_id = valores[3]
            const montadora_nome = valores[4]
            const cor = valores[5]
            const ano_fabricacao = valores[6]
            const ano_modelo = valores[7]
            const valor = valores[8]
            const placa = valores[9]
            const vendido = valores[10] === 'true'
            
            vetor.push({ id, modelo_id, modelo_nome, montadora_id, montadora_nome, cor, ano_fabricacao, ano_modelo, valor, placa, vendido })
        }
    }
    
    return vetor
}

export function salvar_veiculos(vetor) {
    let arquivo = ''
    for(let registro of vetor){
        const conteudo = `${registro.id}|${registro.modelo_id}|${registro.modelo_nome}|${registro.montadora_id}|${registro.montadora_nome}|${registro.cor}|${registro.ano_fabricacao}|${registro.ano_modelo}|${registro.valor}|${registro.placa}|${registro.vendido}\n`
        arquivo += conteudo
    }
    writeFileSync('veiculos.txt', arquivo, 'utf-8')
}

export function adicionar_veiculo(){
    let montadoras = []
    montadoras = load_montadoras()
    let modelos = []
    modelos = load_modelos()
    let veiculos = []
    veiculos = load_veiculos()

    if(montadoras.length > 0 && modelos.length > 0){
        listar_vetor(montadoras, 'Montadora', print_montadoras)
        let indice_usuario_montadora = obter_numero('\nNumero da montadora que deseja cadastrar o veículo: ')
        let indice_montadora = indice_usuario_montadora - 1
        
        clear_screen()

        listar_modelos(modelos, 'Modelo', print_modelos)
        let indice_usuario_modelo = obter_numero('\nNumero do modelo que deseja cadastrar o veículo: ')
        let indice_modelo = indice_usuario_modelo - 1
        let indice_correto = false


        while(indice_correto != true){
            if((indice_montadora >= 0 && indice_montadora < montadoras.length) && (indice_modelo >= 0 && indice_modelo < modelos.length)){
                
                if(montadoras[indice_montadora].id === modelos[indice_modelo].montadora_id){
                    clear_screen()
                    print(`\n>>> DADOS DO MODELO DO VEÍCULO <<<`)
                    let dados = {
                        id: ulid(),
                        modelo_id: modelos[indice_modelo].id,
                        modelo_nome: modelos[indice_modelo].modelo,
                        montadora_id: montadoras[indice_montadora].id,
                        montadora_nome: montadoras[indice_montadora].nome,
                        cor: obter_texto('Cor: '),
                        ano_fabricacao: obter_numero('Ano de fabricação (AAAA): '),
                        ano_modelo: obter_numero('Ano do modelo (AAAA): '),
                        valor: Number(obter_numero('Valor do Veiculo: R$ ')).toFixed(2),
                        placa: obter_texto('Placa: '),
                        vendido: false  // Inicializado como não vendido
                    }
                    veiculos.push(dados)
                    indice_correto = true
                }else{
                    print('\n> Os indices informados nao sao validos ou nao coincidem com o mesmo dado. \nInforme novamente!')
                    enter_to_continue()
                    listar_vetor(montadoras, 'Montadora', print_montadoras)
                    let indice_usuario_montadora = obter_numero('\nNumero da montadora que deseja cadastrar o veículo: ')
                    let indice_montadora = indice_usuario_montadora - 1
                    
                    listar_modelos(modelos, 'Modelo', print_modelos )
                    let indice_usuario_modelo = obter_numero('\nNumero do modelo que deseja cadastrar o veículo: ')
                    let indice_modelo = indice_usuario_modelo - 1

                }
            }
        }
        print('\n>> Referente a Veículos:')
        deseja_salvar(salvar_veiculos, veiculos)
    }else{
        print('\n> Nao ha montadoras e/ou modelos cadastrados!')
    }
    return veiculos
}

export function pedir_dados_listagem_veiculos(){
    print('\n>> LISTAGEM DE VEÍCULOS <<')
    let valor_correto = false
    let propriedade
    let ordem

    while(valor_correto != true){
        propriedade = obter_texto('\nInforme o numero referente a propriedade que deseja listar (placa, ano_fabricacao, ano_modelo, valor, vendido, montadora_nome, modelo_nome): ').toLowerCase()
        ordem = obter_texto('Informe a ordenacao desejada ASC (Ascendente) ou DESC (Descendente): ').toUpperCase()

        if((propriedade === 'placa' || propriedade === 'ano_fabricacao' || propriedade === 'ano_modelo' || propriedade === 'valor' || propriedade === 'vendido' || propriedade === 'montadora_nome' || propriedade === 'modelo_nome') && (ordem === 'ASC' || ordem === 'DESC')){
            valor_correto = true
        }else{
            print('\n> Informe valores de propriedade e ordenação válidos!')
        }
    }
    return {propriedade, ordem}
}

export function listar_veiculos(){
    let montadoras = []
    montadoras = load_montadoras()
    let modelos = []
    modelos = load_modelos()
    let veiculos = []
    veiculos = load_veiculos()
    
    if(montadoras.length > 0 && modelos.length > 0 && veiculos.length > 0){
        const dados = pedir_dados_listagem_veiculos()
        const vetor_ordenado = bubbleSort(veiculos, dados.propriedade, dados.ordem)
        print_veiculos(vetor_ordenado)
        return vetor_ordenado

    }else{
        print('\n> Nao ha montadoras e/ou modelos e/ou veiculos cadastrados!\n> Verifique se você salvou os dados referente a montadoras e veiculos recem adicionados antes de adicionar veiculo <')
    }

}

export function print_veiculos(veiculos_ordenados){
    enter_to_continue()
    print(`\n>>> VEÍCULOS <<<`)
    for(let i = 0; i < veiculos_ordenados.length; i++){
        print(`\n *** Veiculo ${i+1} ***`)
        print(`   ID: ${veiculos_ordenados[i].id}`)
        print(`   ID Modelo: ${veiculos_ordenados[i].modelo_id}`)
        print(`   Nome Modelo: ${veiculos_ordenados[i].modelo_nome}`)
        print(`   ID Montadora: ${veiculos_ordenados[i].montadora_id}`)
        print(`   Nome Montadora: ${veiculos_ordenados[i].montadora_nome}`)
        print(`   Cor do veículo: ${veiculos_ordenados[i].cor}`)
        print(`   Ano de Fabricação: ${Number(veiculos_ordenados[i].ano_fabricacao)}`)
        print(`   Ano do Modelo: ${Number(veiculos_ordenados[i].ano_modelo)}`)
        print(`   Valor do Veiculo: R$ ${Number(veiculos_ordenados[i].valor).toFixed(2)}`)
        print(`   Placa: ${veiculos_ordenados[i].placa}`)
        let status_vendido = veiculos_ordenados[i].vendido
        if(status_vendido === true){
            print(`   Vendido: Sim`)
        }else{
            print(`   Vendido: Nao`)
        }
        print('---------------------------')
    }
    print(`\n>>> Status: Temos ${veiculos_ordenados.length} veiculo(s) cadastrado(s)! <<<`)
}

export function filtrar_placa(placa_veiculo){
    let veiculos_filtrados = []
    for(let registro of lista_de_veiculos){
        if(contem_valor(placa_veiculo, registro.placa)){
            veiculos_filtrados.push(registro)
        }
    }
    return veiculos_filtrados
}

export function filtrar_ano_fabricacao(ano_min, ano_max, ano_fab) {
    let veiculos_filtrados = [];
    
    for (let registro of lista_de_veiculos) {
        if(contem_valor(ano_fab, registro.ano_fabricacao)){
            if (registro.ano_fabricacao >= ano_min && registro.ano_fabricacao <= ano_max) {
                veiculos_filtrados.push(registro)
            }
        }
    }
    return veiculos_filtrados
}

export function filtrar_ano_modelo(ano_min, ano_max, ano_mod) {
    let veiculos_filtrados = [];
    
    for (let registro of lista_de_veiculos) {
        if(contem_valor(ano_mod, registro.ano_modelo)){
            if (registro.ano_modelo >= ano_min && registro.ano_modelo <= ano_max) {
                veiculos_filtrados.push(registro)
            }
        }
    }
    return veiculos_filtrados
}

export function filtrar_valor(valor_veiculo){
    let veiculos_filtrados = []
    for(let registro of lista_de_veiculos){
        if(contem_valor(valor_veiculo, registro.valor)){
            veiculos_filtrados.push(registro)
        }
    }
    return veiculos_filtrados
}

export function filtrar_vendido(veiculo_vendido){
    let veiculos_filtrados = []
    for(let registro of lista_de_veiculos){
        const filtro = veiculo_vendido.toUpperCase() // Converte para maiúsculo para tratar S ou N

        if ((filtro === 'S' && registro.vendido === true) || (filtro === 'N' && registro.vendido === false)) {
            veiculos_filtrados.push(registro)
        }
    }
    return veiculos_filtrados
}

export function filtrar_montadora_nome(nome_mont){
    let veiculos_filtrados = []
    for(let registro of lista_de_veiculos){
        if(contem_valor(nome_mont, registro.montadora_nome)){
            veiculos_filtrados.push(registro)
        }
    }
    return veiculos_filtrados
}

export function filtrar_modelo_nome(nome_mod){
    let veiculos_filtrados = []
    for(let registro of lista_de_veiculos){
        if(contem_valor(nome_mod, registro.modelo_nome)){
            veiculos_filtrados.push(registro)
        }
    }
    return veiculos_filtrados
}

export function filtrar_veiculos(){
    
    if(lista_de_veiculos.length > 0){

        let dados = pedir_dados_listagem_veiculos()
        let valor = obter_texto('Informe o valor que deseja buscar: ')
        let lista_veiculos_filtrados = []
        let resultado = false
        
        while(resultado != true){
            
            if(dados.propriedade === 'placa'){
                lista_veiculos_filtrados = filtrar_placa(valor)
                resultado = true
                
            }else if(dados.propriedade === 'ano_fabricacao'){
                print('\n> Forneça uma faixa de anos para a busca <')
                const ano_minimo = obter_numero_minimo('Informe o ano minimo: ', 1000)
                const ano_maximo = obter_numero_maximo('Informe o ano maximo: ', 2024)
                lista_veiculos_filtrados = filtrar_ano_fabricacao(ano_minimo, ano_maximo, valor)
                resultado = true
                
            }else if(dados.propriedade === 'ano_modelo'){
                print('\n> Forneça uma faixa de anos para a busca <')
                const ano_minimo = obter_numero_minimo('Informe o ano minimo: ', 1000)
                const ano_maximo = obter_numero_maximo('Informe o ano maximo: ', 2024)
                lista_veiculos_filtrados = filtrar_ano_modelo(ano_minimo, ano_maximo, valor)
                resultado = true
                    
            }else if(dados.propriedade === 'valor'){
                lista_veiculos_filtrados = filtrar_valor(valor)
                resultado = true
                
            }else if(dados.propriedade === 'vendido'){
                lista_veiculos_filtrados = filtrar_vendido(valor)
                resultado = true
                
            }else if(dados.propriedade === 'montadora_nome'){
                lista_veiculos_filtrados = filtrar_montadora_nome(valor)
                resultado = true
                
            }else if(dados.propriedade === 'modelo_nome'){
                lista_veiculos_filtrados = filtrar_modelo_nome(valor)
                resultado = true
            }else{
                print('\n>> Propriedade inválida !!!')
                dados = pedir_dados_listagem()
                valor = obter_texto('Informe o valor que deseja buscar: ')
            }
        }   
    
        const veiculos_ordenados = bubbleSort(lista_veiculos_filtrados, dados.propriedade, dados.ordem)
        print_veiculos(veiculos_ordenados)
    }else{
        print('\n> Nenhum Modelo cadastrado!')
    }
    
}

export function atualizar_veiculos(){
    let veiculos = listar_veiculos()
    let indice_usuario = obter_numero('\nInforme o numero do Veiculo que deseja alterar: ')
    let indice = indice_usuario - 1
    let encontrado = false
    clear_screen()
    print(`\n>> Atualização do Veiculo ${indice_usuario} <<\n`)

    while(encontrado != true){
        if(indice >= 0 && indice < veiculos.length){
            let dado_correto = false
            let propriedade
            
            while(dado_correto != true){
                propriedade = obter_texto('\nInforme o nome da propriedade que deseja alterar (placa, ano_fabricacao, ano_modelo, valor, vendido, montadora_nome, modelo_nome): ').toLowerCase()
                if(propriedade === 'placa'){
                    veiculos[indice].placa = obter_texto(`Informe a nova placa do Veiculo: `)
                    dado_correto = true
                }else if(propriedade === 'ano_fabricacao'){
                    veiculos[indice].ano_fabricacao = obter_numero(`Informe o novo Ano de Fabricacao: `)
                    dado_correto = true
                }else if(propriedade === 'ano_modelo'){
                    veiculos[indice].ano_modelo = obter_numero(`Informe o novo Ano de Modelo: `)
                    dado_correto = true
                }else if(propriedade === 'valor'){
                    veiculos[indice].valor = obter_numero(`Informe o novo valor: R$ `)
                    dado_correto = true
                }else if(propriedade === 'vendido'){
                    let foi_vendido = obter_texto(`Vendido (S - sim ou N - nao): `).toUpperCase()
                    if(foi_vendido === 'S'){
                        veiculos[indice].vendido = true
                    }else if(foi_vendido === 'N'){
                        veiculos[indice].vendido = false
                    }
                    dado_correto = true
                }else if(propriedade === 'montadora_nome'){
                    clear_screen()
                    const montadora = filtrar_indice(lista_de_montadoras)
                    veiculos[indice].montadora_nome = montadora.nome
                    dado_correto = true
                }
                print('\n> Informe uma propriedade válida!')
            }
            encontrado = true

        }else{
            print('\nÍndice não encontrado ou inválido!')
            indice_usuario = obter_numero('\nInforme o numero do Veiculo que deseja alterar: ')
            indice = indice_usuario - 1
        }
    }
    clear_screen()
    print(`\n> Veiculo ${indice_usuario} alterado com sucesso!`)
    enter_to_continue()
    print('\n>> Referente a Veículos:')
    deseja_salvar(salvar_veiculos, veiculos)
    return veiculos
}

export function remover_veiculos(){
    let veiculos = listar_veiculos()
    let indice_usuario = obter_numero('\nInforme o numero do Veiculo que deseja remover: ')
    let indice = indice_usuario - 1
    let encontrado = false

    while(encontrado != true){
        if(indice >= 0 && indice < veiculos.length){
            veiculos.splice(indice, 1)
            encontrado = true
        }else{
            print('\nÍndice não encontrado ou inválido!')
            indice_usuario = obter_numero('\nInforme o numero do Veiculo que deseja remover: ')
            indice = indice_usuario - 1
        }
    }
    clear_screen()
    print(`\n> Veiculo ${indice_usuario} removido com sucesso!`)
    enter_to_continue()
    print('\n>> Referente a Veículos:')
    deseja_salvar(salvar_veiculos, veiculos)
    return veiculos
}
