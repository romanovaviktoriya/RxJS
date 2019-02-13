//** Запрос количества репозиториев на ГитХабе по значению поля ввода с задержкой в 0.5 сек */
import { Observable, fromEvent } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

type liel = {
    full_name: string,
    name: string,
    html_url: string,
    forks: number,
    stargazers_count: number
};
type ulist = {
    items: liel[]
};

const search: HTMLInputElement = document.querySelector('#field');
const observable$: Observable<Object> = fromEvent<KeyboardEvent>(search, 'input');
const list: HTMLTableElement = document.createElement('table');

document.body.appendChild(list);

observable$.pipe(
    map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
    filter((value: string) => value !== ''),
    debounceTime(500), 
    distinctUntilChanged(), 
    switchMap((value: string) => 
        fetch(`https://api.github.com/search/repositories?q=${value}`)
        .then(response => response.json())
    ),
    map((li: ulist) => li.items.map((i: liel) => i))
).subscribe(answers => {
    if (answers === undefined) {
        return [];
    } else {
        list.innerHTML = answers.map((rep) => `<tr><td>fork: ${rep.forks}</td><td>stars: ${rep.stargazers_count}</td><td><p><a href="${rep.html_url}" target="_blank">${rep.name}</a> / ${rep.full_name}</p></td></tr>`).join(''); 
    }
});
//** end */