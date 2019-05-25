import { DictionaryDefinition, DictionaryId, CSpellUserSettings } from '../Settings';
import { filterDictDefsToLoad } from '../Settings/DictionarySettings';
import { loadDictionary } from './DictionaryLoader';
import { SpellingDictionary, createSpellingDictionary } from './SpellingDictionary';
import { createCollectionP } from './SpellingDictionaryCollection';
import { SpellingDictionaryCollection } from './index';


export function loadDictionaries(dictIds: DictionaryId[], defs: DictionaryDefinition[]): Promise<SpellingDictionary>[] {
    const defsToLoad = filterDictDefsToLoad(dictIds, defs);

    return defsToLoad
        .map(e => e[1])
        .map(def => loadDictionary(def.path!, def));
}

export function getDictionary(settings: CSpellUserSettings): Promise<SpellingDictionaryCollection> {
    const { words = [], userWords = [], dictionaries = [], dictionaryDefinitions = [], flagWords = [], caseSensitive = false } = settings;
    const spellDictionaries = loadDictionaries(dictionaries, dictionaryDefinitions);
    const settingsDictionary = createSpellingDictionary(
        words.concat(userWords),
        'user_words',
        'From Settings',
        { caseSensitive }
    );
    return createCollectionP([...spellDictionaries, settingsDictionary], 'dictionary collection', flagWords);
}