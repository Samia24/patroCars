import { clear_screen, deseja_salvar, enter_to_continue, obter_numero, obter_texto, print } from "./utils.js"
import { adicionar_nova_montadora, listar_vetor, atualizar_montadoras, filtrar_montadoras, load_montadoras, salvar_montadoras, print_montadoras, remover } from "./v1_montadoras.js"
import { load_modelos, adicionar_modelo, salvar_modelos, print_modelos, listar_modelos, filtrar_modelos_veiculos, remover_modelo, atualizar_modelos } from "./v2_modelos.js"
import { adicionar_veiculo, atualizar_veiculos, filtrar_veiculos, listar_veiculos, load_veiculos, remover_veiculos, salvar_veiculos } from "./v3_veiculos.js"


export let lista_de_montadoras = load_montadoras()
export let lista_de_modelos = load_modelos()
export let lista_de_veiculos = load_veiculos()

let opcao

function main(){
    print(menu())
    
    while(opcao != 0){
        opcao = obter_numero(`\n    >>> Opcao: `)
        clear_screen()

        if (opcao === 1){
            adicionar_nova_montadora()
            enter_to_continue()
        }else if(opcao === 2){
            listar_vetor(lista_de_montadoras, 'Montadora', print_montadoras)
            enter_to_continue()
        }else if(opcao === 3){
            atualizar_montadoras(lista_de_montadoras)
            enter_to_continue()
        }else if(opcao === 4){
            filtrar_montadoras(lista_de_montadoras)
            enter_to_continue()
        }else if(opcao === 5){
            const registros_removidos = remover()
            lista_de_montadoras = registros_removidos.montadoras
            lista_de_modelos = registros_removidos.modelos
            lista_de_veiculos = registros_removidos.veiculos
            enter_to_continue()
        }else if(opcao === 6){
            clear_screen()
            print('\n>> Referente a Montadoras:')
            deseja_salvar(salvar_montadoras, lista_de_montadoras)
            enter_to_continue()
            print('\n>> Referente a Modelos de Veículos:')
            deseja_salvar(salvar_modelos, lista_de_modelos)
            enter_to_continue()
            print('\n>> Referente a Veículos:')
            deseja_salvar(salvar_veiculos, lista_de_veiculos)
            enter_to_continue()
        }else if(opcao === 7){
            adicionar_modelo(lista_de_modelos, lista_de_montadoras)
            enter_to_continue()
        }else if(opcao === 8){
            listar_modelos(lista_de_modelos, 'Modelo', print_modelos)
            enter_to_continue()
        }else if(opcao === 9){
            filtrar_modelos_veiculos(lista_de_modelos)
            enter_to_continue()
        }else if(opcao === 10){
            remover_modelo(lista_de_modelos)
            enter_to_continue()
        }else if(opcao === 11){
            atualizar_modelos(lista_de_modelos)
            enter_to_continue()
        }else if(opcao === 12){
            adicionar_veiculo()
            enter_to_continue()
        }else if(opcao === 13){
            listar_veiculos()
            enter_to_continue()
        }else if(opcao === 14){
            filtrar_veiculos()
            enter_to_continue()
        }else if(opcao === 15){
            remover_veiculos()
            enter_to_continue()
        }else if(opcao === 16){
            atualizar_veiculos()
            enter_to_continue()
        }else{
            print('Opção inválida! Informe novamente a opção desejada.')
        }
        print(menu())
    }
    clear_screen()
    print('\n>> Referente a Montadoras:')
    deseja_salvar(salvar_montadoras, lista_de_montadoras)
    enter_to_continue()
    print('\n>> Referente a Modelos de Veículos:')
    deseja_salvar(salvar_modelos, lista_de_modelos)
    enter_to_continue()
    print('\n>> Referente a Veículos:')
    deseja_salvar(salvar_veiculos, lista_de_veiculos)
    enter_to_continue()
    print('\n>>> Obrigada por utilizar nossos serviços. Volte Sempre =)')

}

function menu(){
    let opcao = `
    |--------------------------------- PATROCARS ---------------------------------| 
                                |
        >>> MONTADORA <<<       | >>> MODELO DE VEÍCULO <<< |    >>> VEÍCULO <<<
                                |                           |
    1. Cadastrar Montadora      | 7. Adicionar Modelo       | 12. Adicionar Veiculo 
    2. Listar Montadoras        | 8. Listar Modelos         | 13. Listar Veiculo 
    3. Atualizar Montadoras     | 9. Filtrar Modelos        | 14. Filtrar Veiculo
    4. Filtrar Montadoras       | 10. Remover Modelo        | 15. Remover Veiculo
    5. Remover Montadora        | 11. Atualizar Modelo      | 16. Atualizar Veiculo
    _______________________________________________________________________________
           
    ******** SALVAR DADOS ********    
                                
    >> 6. Salvar Dados em Arquivo  
                               
    ******************************        
    ...

    0 ou <enter>. Sair`
    
    return opcao
}



main()